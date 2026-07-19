import "server-only";
import { startOfMonth } from "@/lib/time";
import { getDb } from "@/lib/db";

const LIMITS = { FREE: 5, PRO: 100, TEAM: 500 } as const;

export async function getEntitlements(workspaceId: string) {
  const db = getDb();
  const [subscription, used] = await Promise.all([
    db.subscription.findUnique({ where: { workspaceId } }),
    db.usageEvent.aggregate({
      where: { workspaceId, type: "generation", status: { in: ["RESERVED", "SUCCEEDED"] }, createdAt: { gte: startOfMonth(new Date()) } },
      _sum: { quantity: true },
    }),
  ]);
  const plan = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING" ? subscription.plan : "FREE";
  const limit = LIMITS[plan];
  return { plan, limit, used: used._sum.quantity ?? 0, remaining: Math.max(0, limit - (used._sum.quantity ?? 0)) };
}

export async function reserveGeneration(workspaceId: string, requestId: string, metadata?: Record<string, string | number>) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const subscription = await tx.subscription.findUnique({ where: { workspaceId } });
    const plan = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING" ? subscription.plan : "FREE";
    const limits = { FREE: 5, PRO: 100, TEAM: 500 } as const;
    const used = await tx.usageEvent.aggregate({
      where: { workspaceId, type: "generation", status: { in: ["RESERVED", "SUCCEEDED"] }, createdAt: { gte: startOfMonth(new Date()) } },
      _sum: { quantity: true },
    });
    if ((used._sum.quantity ?? 0) >= limits[plan]) throw new Error("Monthly generation quota reached. Upgrade your plan to continue.");
    return tx.usageEvent.create({ data: { workspaceId, type: "generation", quantity: 1, requestId, status: "RESERVED", metadata } });
  }, { isolationLevel: "Serializable" });
}

export async function finalizeGeneration(requestId: string, succeeded: boolean) {
  await getDb().usageEvent.update({
    where: { requestId },
    data: { status: succeeded ? "SUCCEEDED" : "FAILED", quantity: succeeded ? 1 : 0 },
  });
}
