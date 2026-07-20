"use server";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser, requireWorkspaceRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";

const digest=(value:string)=>createHash("sha256").update(value).digest("hex");

export async function switchWorkspace(formData:FormData){
  const workspaceId=z.string().min(1).parse(formData.get("workspaceId"));
  const user=await requireUser();
  if(!user.memberships.some(item=>item.workspaceId===workspaceId))throw new Error("Workspace not found.");
  (await cookies()).set("launchpilot_workspace",workspaceId,{httpOnly:true,sameSite:"lax",secure:env.APP_URL.startsWith("https://"),path:"/"});
  redirect("/summary");
}

export async function createWorkspace(formData:FormData){
  const name=z.string().trim().min(2).max(100).parse(formData.get("name"));
  const user=await requireUser();const slug=`${name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}-${crypto.randomUUID().slice(0,6)}`;
  const workspace=await getDb().workspace.create({data:{name,slug,subscription:{create:{}},memberships:{create:{userId:user.id,role:"OWNER"}}}});
  (await cookies()).set("launchpilot_workspace",workspace.id,{httpOnly:true,sameSite:"lax",secure:env.APP_URL.startsWith("https://"),path:"/"});
  redirect("/summary");
}

export async function inviteMember(formData:FormData){
  const input=z.object({email:z.email().transform(v=>v.toLowerCase()),role:z.enum(["ADMIN","MEMBER"])}).parse(Object.fromEntries(formData));
  const {workspace,user}=await requireWorkspaceRole(["OWNER","ADMIN"]);
  const token=randomBytes(32).toString("base64url");
  await getDb().invitation.create({data:{workspaceId:workspace.id,email:input.email,role:input.role,tokenHash:digest(token),expiresAt:new Date(Date.now()+7*86400000)}});
  await getDb().auditEvent.create({data:{workspaceId:workspace.id,actorId:user.id,action:"member.invited",metadata:{email:input.email,role:input.role}}});
  await sendEmail(input.email,`Join ${workspace.name} on LaunchPilot`,`<p><a href="${env.APP_URL}/invite?token=${encodeURIComponent(token)}">Accept invitation</a>. This invitation expires in seven days.</p>`);
  revalidatePath("/team");
}

export async function acceptInvitation(formData:FormData){
  const token=z.string().min(20).parse(formData.get("token"));const user=await requireUser();
  const invitation=await getDb().invitation.findFirst({where:{tokenHash:digest(token),status:"PENDING",expiresAt:{gt:new Date()}}});
  if(!invitation||invitation.email!==user.email)throw new Error("This invitation is invalid, expired, or belongs to another email.");
  await getDb().$transaction([
    getDb().membership.upsert({where:{userId_workspaceId:{userId:user.id,workspaceId:invitation.workspaceId}},create:{userId:user.id,workspaceId:invitation.workspaceId,role:invitation.role},update:{role:invitation.role}}),
    getDb().invitation.update({where:{id:invitation.id},data:{status:"ACCEPTED",acceptedAt:new Date()}}),
    getDb().auditEvent.create({data:{workspaceId:invitation.workspaceId,actorId:user.id,action:"member.joined"}}),
  ]);
  (await cookies()).set("launchpilot_workspace",invitation.workspaceId,{httpOnly:true,sameSite:"lax",secure:env.APP_URL.startsWith("https://"),path:"/"});
  redirect("/summary");
}

export async function updateMemberRole(formData:FormData){
  const input=z.object({membershipId:z.string(),role:z.enum(["ADMIN","MEMBER"])}).parse(Object.fromEntries(formData));
  const {workspace,user}=await requireWorkspaceRole(["OWNER"]);
  const member=await getDb().membership.findFirst({where:{id:input.membershipId,workspaceId:workspace.id}});
  if(!member||member.role==="OWNER")throw new Error("This member cannot be changed.");
  await getDb().membership.update({where:{id:member.id},data:{role:input.role}});
  await getDb().auditEvent.create({data:{workspaceId:workspace.id,actorId:user.id,action:"member.role_changed",targetId:member.id,metadata:{role:input.role}}});
  revalidatePath("/team");
}

export async function removeMember(formData:FormData){
  const membershipId=z.string().parse(formData.get("membershipId"));const {workspace,user}=await requireWorkspaceRole(["OWNER","ADMIN"]);
  const member=await getDb().membership.findFirst({where:{id:membershipId,workspaceId:workspace.id}});
  if(!member||member.role==="OWNER")throw new Error("This member cannot be removed.");
  await getDb().membership.delete({where:{id:member.id}});
  await getDb().auditEvent.create({data:{workspaceId:workspace.id,actorId:user.id,action:"member.removed",targetId:member.id}});
  revalidatePath("/team");
}
