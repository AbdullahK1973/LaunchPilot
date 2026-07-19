"use server";

import { createHash, randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createPasswordHash, destroySession, requireUser, verifyPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export type AccountState = { error?: string; success?: string };
const digest = (token: string) => createHash("sha256").update(token).digest("hex");
const emailSchema = z.email().transform((value) => value.toLowerCase());

export async function requestPasswordReset(_: AccountState, formData: FormData): Promise<AccountState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Enter a valid email address." };
  if (!await rateLimit(`password-reset:${parsed.data}`, 3, 15 * 60_000)) return { success: "If that account exists, a reset link has been sent." };
  const user = await getDb().user.findUnique({ where: { email: parsed.data } });
  if (user) {
    const token = randomBytes(32).toString("base64url");
    await getDb().passwordResetToken.create({ data: { userId: user.id, tokenHash: digest(token), expiresAt: new Date(Date.now() + 60 * 60_000) } });
    await sendEmail(user.email, "Reset your LaunchPilot password", `<p><a href="${env.APP_URL}/reset-password?token=${encodeURIComponent(token)}">Reset your password</a>. This link expires in one hour.</p>`);
  }
  return { success: "If that account exists, a reset link has been sent." };
}

export async function resetPassword(_: AccountState, formData: FormData): Promise<AccountState> {
  const parsed = z.object({ token: z.string().min(20), password: z.string().min(8).max(128) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Use a password of at least 8 characters." };
  const record = await getDb().passwordResetToken.findFirst({ where: { tokenHash: digest(parsed.data.token), usedAt: null, expiresAt: { gt: new Date() } } });
  if (!record) return { error: "This reset link is invalid or has expired." };
  await getDb().$transaction([
    getDb().user.update({ where: { id: record.userId }, data: { passwordHash: await createPasswordHash(parsed.data.password) } }),
    getDb().passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    getDb().session.deleteMany({ where: { userId: record.userId } }),
  ]);
  return { success: "Password updated. You can now sign in." };
}

export async function sendVerificationEmail(userId?: string) {
  const user = userId ? await getDb().user.findUnique({ where: { id: userId } }) : await requireUser();
  if (!user || user.emailVerifiedAt) return;
  const token = randomBytes(32).toString("base64url");
  await getDb().emailVerificationToken.create({ data: { userId: user.id, tokenHash: digest(token), expiresAt: new Date(Date.now() + 24 * 60 * 60_000) } });
  await sendEmail(user.email, "Verify your LaunchPilot email", `<p><a href="${env.APP_URL}/verify-email?token=${encodeURIComponent(token)}">Verify your email</a>. This link expires in 24 hours.</p>`);
}

async function verifyEmailToken(token: string) {
  const record = await getDb().emailVerificationToken.findFirst({ where: { tokenHash: digest(token), usedAt: null, expiresAt: { gt: new Date() } } });
  if (!record) return false;
  await getDb().$transaction([
    getDb().user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } }),
    getDb().emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  return true;
}

export async function verifyEmail(formData: FormData) {
  const token = z.string().min(20).parse(formData.get("token"));
  const valid = await verifyEmailToken(token);
  redirect(valid ? "/summary?verified=1" : "/verify-email?invalid=1");
}

export async function deleteAccount(formData: FormData) {
  const user = await requireUser();
  if (formData.get("confirmation") !== "DELETE") throw new Error("Type DELETE to confirm.");
  const owned = await getDb().membership.findMany({ where: { userId: user.id, role: "OWNER" }, include: { workspace: { include: { _count: { select: { memberships: true } } } } } });
  if (owned.some(item => item.workspace._count.memberships > 1)) throw new Error("Transfer ownership of shared workspaces before deleting your account.");
  await getDb().$transaction([
    ...owned.map(item => getDb().workspace.delete({ where: { id: item.workspaceId } })),
    getDb().user.delete({ where: { id: user.id } }),
  ]);
  await destroySession();
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const name = z.string().trim().min(2).max(80).parse(formData.get("name"));
  const user = await requireUser();
  await getDb().user.update({ where: { id: user.id }, data: { name } });
  redirect("/account");
}

export async function changePassword(formData: FormData) {
  const input = z.object({ currentPassword: z.string(), newPassword: z.string().min(8).max(128) }).parse(Object.fromEntries(formData));
  const user = await requireUser();
  const stored = await getDb().user.findUniqueOrThrow({ where: { id: user.id } });
  if (!await verifyPassword(input.currentPassword, stored.passwordHash)) throw new Error("Current password is incorrect.");
  await getDb().$transaction([
    getDb().user.update({ where: { id: user.id }, data: { passwordHash: await createPasswordHash(input.newPassword) } }),
    getDb().session.deleteMany({ where: { userId: user.id } }),
  ]);
  await destroySession();
  redirect("/login");
}

export async function revokeOtherSessions() {
  const user = await requireUser();
  await getDb().session.deleteMany({ where: { userId: user.id } });
  await destroySession();
  redirect("/login");
}
