"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireWorkspace } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { encryptSecret } from "@/lib/secrets";

export async function updateWorkspace(formData:FormData){
  const input=z.object({name:z.string().trim().min(2).max(100),defaultTone:z.string().trim().min(2).max(40)}).parse(Object.fromEntries(formData));
  const {workspace}=await requireWorkspace();
  await getDb().workspace.update({where:{id:workspace.id},data:input});
  revalidatePath("/settings");
}
export async function saveIntegration(formData:FormData){
  const input=z.object({provider:z.enum(["shopify","klaviyo","webhook"]),label:z.string().min(2).max(80),endpoint:z.string().trim().min(1),secret:z.string().min(1),listId:z.string().optional(),senderEmail:z.union([z.email(),z.literal("")]).optional(),senderLabel:z.string().max(100).optional()}).parse(Object.fromEntries(formData));
  const {workspace}=await requireWorkspace();
  if(input.provider==="shopify"&&!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(input.endpoint))throw new Error("Enter a valid myshopify.com domain.");
  if(input.provider==="webhook")z.url().parse(input.endpoint);
  const config={endpoint:input.endpoint,secret:encryptSecret(input.secret),listId:input.listId||null,senderEmail:input.senderEmail||null,senderLabel:input.senderLabel||null};
  await getDb().integration.upsert({where:{workspaceId_provider:{workspaceId:workspace.id,provider:input.provider}},create:{workspaceId:workspace.id,provider:input.provider,label:input.label,config},update:{label:input.label,config,enabled:true,lastError:null}});
  revalidatePath("/settings");
}
