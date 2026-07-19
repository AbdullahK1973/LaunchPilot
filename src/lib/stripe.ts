import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured.");
  return new Stripe(env.STRIPE_SECRET_KEY);
}
