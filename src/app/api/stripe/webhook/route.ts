import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import type Stripe from "stripe";

function mappedStatus(status: Stripe.Subscription.Status) {
  if (status === "active") return "ACTIVE" as const;
  if (status === "trialing") return "TRIALING" as const;
  if (status === "past_due" || status === "unpaid") return "PAST_DUE" as const;
  if (status === "canceled") return "CANCELED" as const;
  return "INACTIVE" as const;
}

export async function POST(request: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  try {
    const signature = (await headers()).get("stripe-signature");
    if (!signature) throw new Error("Missing signature.");
    const event = getStripe().webhooks.constructEvent(await request.text(), signature, env.STRIPE_WEBHOOK_SECRET);
    await getDb().$transaction(async (tx) => {
      const processed = await tx.stripeEvent.findUnique({ where: { id: event.id } });
      if (processed) return;

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const workspaceId = session.metadata?.workspaceId;
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        if (workspaceId) await tx.subscription.upsert({
          where: { workspaceId },
          create: { workspaceId, stripeCustomerId: String(session.customer), stripeSubscriptionId: subscriptionId },
          update: { stripeCustomerId: String(session.customer), stripeSubscriptionId: subscriptionId },
        });
      }

      if (event.type.startsWith("customer.subscription.")) {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
        const status = mappedStatus(subscription.status);
        const item = subscription.items.data[0];
        const isKnownProPrice = Boolean(env.STRIPE_PRO_PRICE_ID && item?.price.id === env.STRIPE_PRO_PRICE_ID);
        await tx.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: subscription.id,
            status,
            plan: (status === "ACTIVE" || status === "TRIALING") && isKnownProPrice ? "PRO" : "FREE",
            currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
          },
        });
      }
      await tx.stripeEvent.create({ data: { id: event.id, type: event.type } });
    });
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook." }, { status: 400 });
  }
}
