"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace, authorizeLaunch } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { launchSchema } from "@/lib/schemas";
import { consumeGeneration } from "@/lib/entitlements";
import { generateLaunchOutput, buildPrompt } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";
import type { LaunchActionId, OutputSection } from "@/types/launch";

export type FormState = { error?: string };

export async function createLaunch(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = launchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the launch details." };
  const { workspace } = await requireWorkspace();
  const data = parsed.data;
  const db = getDb();
  const launch = await db.$transaction(async (tx) => {
    const brand = await tx.brand.create({ data: { workspaceId: workspace.id, name: data.brandName, tone: data.brandTone, targetAudience: data.targetAudience, launchGoal: data.launchGoal } });
    const product = await tx.product.create({ data: { brandId: brand.id, name: data.productName, category: data.productCategory, description: data.productDescription, keyFeatures: data.keyFeatures, price: data.price, competitorUrl: data.competitorLink || null, productUrl: data.existingProductUrl || null, specialNotes: data.specialNotes || null } });
    return tx.launch.create({ data: { workspaceId: workspace.id, productId: product.id, name: `${data.productName} launch`, status: "READY" } });
  });
  redirect(`/launches/${launch.id}`);
}

export async function generateOutput(launchId: string, actionId: LaunchActionId, note = "", previousSections?: OutputSection[]) {
  const { launch, workspace } = await authorizeLaunch(launchId);
  if (!rateLimit(`generation:${workspace.id}`, 10, 60_000)) throw new Error("Too many generation requests. Try again in a minute.");
  await consumeGeneration(workspace.id, { launchId, actionId });
  const context = {
    actionId, note, previousSections,
    brand: { name: launch.product.brand.name, tone: launch.product.brand.tone, targetAudience: launch.product.brand.targetAudience, launchGoal: launch.product.brand.launchGoal },
    product: { name: launch.product.name, category: launch.product.category, description: launch.product.description, keyFeatures: launch.product.keyFeatures, price: launch.product.price, specialNotes: launch.product.specialNotes, images: launch.product.images.map(({ url }) => ({ url })) },
  };
  const result = await generateLaunchOutput(context);
  const existing = await getDb().output.findFirst({ where: { launchId, actionId }, include: { _count: { select: { revisions: true } } } });
  const output = existing
    ? await getDb().output.update({ where: { id: existing.id }, data: { note, revisions: { create: { version: existing._count.revisions + 1, sections: result.sections, prompt: buildPrompt(context), model: result.model, inputTokens: result.inputTokens, outputTokens: result.outputTokens } } } })
    : await getDb().output.create({ data: { launchId, actionId, title: actionId, note, revisions: { create: { version: 1, sections: result.sections, prompt: buildPrompt(context), model: result.model, inputTokens: result.inputTokens, outputTokens: result.outputTokens } } } });
  await getDb().launch.update({ where: { id: launchId }, data: { status: "COMPLETE" } });
  revalidatePath(`/launches/${launchId}`);
  return { outputId: output.id, sections: result.sections };
}

export async function archiveLaunch(launchId: string) {
  await authorizeLaunch(launchId);
  await getDb().launch.update({ where: { id: launchId }, data: { status: "ARCHIVED" } });
  revalidatePath("/summary");
}

export async function deleteLaunch(launchId: string) {
  await authorizeLaunch(launchId);
  await getDb().launch.delete({ where: { id: launchId } });
  redirect("/summary");
}
