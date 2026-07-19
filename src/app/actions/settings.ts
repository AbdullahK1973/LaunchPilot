"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireWorkspace } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function updateWorkspace(formData:FormData){
  const input=z.object({name:z.string().trim().min(2).max(100),defaultTone:z.string().trim().min(2).max(40)}).parse(Object.fromEntries(formData));
  const {workspace}=await requireWorkspace();
  await getDb().workspace.update({where:{id:workspace.id},data:input});
  revalidatePath("/settings");
}
export async function saveIntegration(formData:FormData){
  const input=z.object({provider:z.enum(["shopify","klaviyo","webhook"]),label:z.string().min(2).max(80),endpoint:z.union([z.url(),z.literal("")])}).parse(Object.fromEntries(formData));
  const {workspace}=await requireWorkspace();
  await getDb().integration.upsert({where:{workspaceId_provider:{workspaceId:workspace.id,provider:input.provider}},create:{workspaceId:workspace.id,provider:input.provider,label:input.label,config:{endpoint:input.endpoint}},update:{label:input.label,config:{endpoint:input.endpoint},enabled:true}});
  revalidatePath("/settings");
}
