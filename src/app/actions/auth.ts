"use server";

import { redirect } from "next/navigation";
import { createPasswordHash, createSession, destroySession, verifyPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { authSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/app/actions/account";

export type AuthState = { error?: string };

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const result = authSchema.safeParse(Object.fromEntries(formData));
  if (!result.success || !result.data.name) return { error: "Enter a valid name, email, and password of at least 8 characters." };
  const db = getDb();
  if (await db.user.findUnique({ where: { email: result.data.email } })) return { error: "An account already exists for this email." };
  const slug = `${result.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID().slice(0, 6)}`;
  const user = await db.user.create({
    data: {
      name: result.data.name, email: result.data.email, passwordHash: await createPasswordHash(result.data.password),
      memberships: { create: { role: "OWNER", workspace: { create: { name: `${result.data.name}'s workspace`, slug, subscription: { create: {} } } } } },
    },
  });
  await sendVerificationEmail(user.id);
  await createSession(user.id);
  redirect("/summary");
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const result = authSchema.omit({ name: true }).safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Invalid email or password." };
  if (!await rateLimit(`sign-in:${result.data.email}`, 8, 15 * 60_000)) return { error: "Too many sign-in attempts. Try again later." };
  const user = await getDb().user.findUnique({ where: { email: result.data.email } });
  if (!user || !(await verifyPassword(result.data.password, user.passwordHash))) return { error: "Invalid email or password." };
  await createSession(user.id);
  redirect("/summary");
}

export async function signOut() {
  await destroySession();
  redirect("/");
}
