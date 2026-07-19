import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { env } from "@/lib/env";
import { getDb } from "@/lib/db";

const COOKIE_NAME = "launchpilot_session";
const SESSION_DAYS = 30;
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createPasswordHash(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await getDb().session.create({ data: { userId, tokenHash: tokenHash(token), expiresAt } });
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true, sameSite: "lax", secure: env.APP_URL.startsWith("https://"), expires: expiresAt, path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) await getDb().session.deleteMany({ where: { tokenHash: tokenHash(token) } });
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await getDb().session.findFirst({
    where: { tokenHash: tokenHash(token), expiresAt: { gt: new Date() } },
    include: { user: { include: { memberships: { include: { workspace: true } } } } },
  });
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireWorkspace() {
  const user = await requireUser();
  const membership = user.memberships[0];
  if (!membership) throw new Error("No workspace membership found.");
  return { user, membership, workspace: membership.workspace };
}

export async function authorizeLaunch(launchId: string) {
  const { workspace } = await requireWorkspace();
  const launch = await getDb().launch.findFirst({
    where: { id: launchId, workspaceId: workspace.id },
    include: { product: { include: { brand: true, images: true } }, outputs: { include: { revisions: { orderBy: { version: "desc" }, take: 1 } } } },
  });
  if (!launch) throw new Error("Launch not found.");
  return { launch, workspace };
}
