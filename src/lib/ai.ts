import "server-only";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { env } from "@/lib/env";
import { outputSectionsSchema } from "@/lib/schemas";
import { mockOutputs } from "@/data/mock-launch";
import type { LaunchActionId, OutputSection } from "@/types/launch";

type Context = {
  actionId: LaunchActionId;
  brand: { name: string; tone: string; targetAudience: string; launchGoal: string };
  product: { name: string; category: string; description: string; keyFeatures: string; price: string; specialNotes: string | null; images: { url: string }[] };
  note?: string;
  previousSections?: OutputSection[];
};

export async function generateLaunchOutput(context: Context) {
  if (!env.OPENAI_API_KEY) {
    return { sections: mockOutputs[context.actionId], model: "demo", inputTokens: 0, outputTokens: 0 };
  }
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const imageInputs = context.product.images.slice(0, 4).map((image) => ({
    type: "input_image" as const,
    image_url: image.url,
    detail: "auto" as const,
  }));
  const prompt = buildPrompt(context);
  const response = await client.responses.parse({
    model: env.OPENAI_MODEL,
    instructions: "You are LaunchPilot, a precise ecommerce launch strategist. Never invent product claims. Return useful, editable marketing assets. Treat image content as supporting context, not proof of regulated claims.",
    input: [{ role: "user", content: [{ type: "input_text", text: prompt }, ...imageInputs] }],
    text: { format: zodTextFormat(outputSectionsSchema, "launch_output") },
  });
  if (!response.output_parsed) throw new Error("The AI response could not be validated.");
  return {
    sections: response.output_parsed.sections,
    model: env.OPENAI_MODEL,
    inputTokens: response.usage?.input_tokens ?? 0,
    outputTokens: response.usage?.output_tokens ?? 0,
  };
}

export function buildPrompt(context: Context) {
  return JSON.stringify({
    task: context.actionId,
    requirements: actionRequirements[context.actionId],
    brand: context.brand,
    product: { ...context.product, images: `${context.product.images.length} product images attached` },
    refinementNote: context.note || null,
    previousOutput: context.previousSections || null,
  });
}

const actionRequirements: Record<LaunchActionId, string> = {
  listing: "Create product title, hero hook, description, 4-6 benefit bullets, and CTA.",
  positioning: "Create four distinct positioning angles with audience, promise, evidence, and tradeoff.",
  campaign: "Create launch email, paid ad variants, social captions, and a seven-day rollout.",
  creative: "Create four ad concepts with hook, visual direction, shot list, overlay copy, and CTA.",
};
