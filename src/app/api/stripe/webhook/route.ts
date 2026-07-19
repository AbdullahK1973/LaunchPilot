import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(request:Request){
  if(!env.STRIPE_WEBHOOK_SECRET)return NextResponse.json({error:"Webhook is not configured."},{status:503});
  try{
    const signature=(await headers()).get("stripe-signature");if(!signature)throw new Error("Missing signature.");
    const event=getStripe().webhooks.constructEvent(await request.text(),signature,env.STRIPE_WEBHOOK_SECRET);
    if(event.type.startsWith("customer.subscription.")){
      const sub=event.data.object as Stripe.Subscription;
      const customerId=typeof sub.customer==="string"?sub.customer:sub.customer.id;
      const status=sub.status==="active"?"ACTIVE":sub.status==="trialing"?"TRIALING":sub.status==="past_due"?"PAST_DUE":sub.status==="canceled"?"CANCELED":"INACTIVE";
      await getDb().subscription.updateMany({where:{stripeCustomerId:customerId},data:{stripeSubscriptionId:sub.id,status,plan:status==="ACTIVE"||status==="TRIALING"?"PRO":"FREE"}});
    }
    return NextResponse.json({received:true});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Invalid webhook."},{status:400});}
}
