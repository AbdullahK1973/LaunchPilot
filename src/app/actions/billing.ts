"use server";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth";
import { env } from "@/lib/env";
import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function startCheckout(){
  if(!env.STRIPE_PRO_PRICE_ID) throw new Error("Stripe Pro pricing is not configured.");
  const {user,workspace}=await requireWorkspace();
  const db=getDb();const stripe=getStripe();
  let subscription=await db.subscription.findUnique({where:{workspaceId:workspace.id}});
  let customerId=subscription?.stripeCustomerId;
  if(!customerId){const customer=await stripe.customers.create({email:user.email,name:workspace.name,metadata:{workspaceId:workspace.id}});customerId=customer.id;subscription=await db.subscription.upsert({where:{workspaceId:workspace.id},create:{workspaceId:workspace.id,stripeCustomerId:customerId},update:{stripeCustomerId:customerId}});}
  const session=await stripe.checkout.sessions.create({mode:"subscription",customer:customerId,line_items:[{price:env.STRIPE_PRO_PRICE_ID,quantity:1}],success_url:`${env.APP_URL}/billing?success=1`,cancel_url:`${env.APP_URL}/billing`,metadata:{workspaceId:workspace.id}});
  if(!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}
export async function openBillingPortal(){
  const {workspace}=await requireWorkspace();const subscription=await getDb().subscription.findUnique({where:{workspaceId:workspace.id}});
  if(!subscription?.stripeCustomerId) throw new Error("No billing customer exists.");
  const portal=await getStripe().billingPortal.sessions.create({customer:subscription.stripeCustomerId,return_url:`${env.APP_URL}/billing`});
  redirect(portal.url);
}
