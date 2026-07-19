import "server-only";
import { startOfMonth } from "@/lib/time";
import { getDb } from "@/lib/db";

const LIMITS = { FREE: 5, PRO: 100, TEAM: 500 } as const;

export async function getEntitlements(workspaceId: string) {
  const db = getDb();
  const [subscription, used] = await Promise.all([
    db.subscription.findUnique({ where: { workspaceId } }),
    db.usageEvent.aggregate({
      where: { workspaceId, type: "generation", createdAt: { gte: startOfMonth(new Date()) } },
      _sum: { quantity: true },
    }),
  ]);
  const plan = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING" ? subscription.plan : "FREE";
  const limit = LIMITS[plan];
  return { plan, limit, used: used._sum.quantity ?? 0, remaining: Math.max(0, limit - (used._sum.quantity ?? 0)) };
}

export async function consumeGeneration(workspaceId: string, metadata?: Record<string, string | number>) {
  const entitlement = await getEntitlements(workspaceId);
  if (entitlement.remaining < 1) throw new Error("Monthly generation quota reached. Upgrade your plan to continue.");
  await getDb().usageEvent.create({ data: { workspaceId, type: "generation", quantity: 1, metadata } });
  return entitlement;
}
