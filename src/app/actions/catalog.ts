"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireWorkspace } from "@/lib/auth";
import { getDb } from "@/lib/db";

const brandSchema=z.object({name:z.string().trim().min(2).max(120),tone:z.string().trim().min(2).max(40),targetAudience:z.string().trim().min(10).max(3000),launchGoal:z.string().trim().min(10).max(2000)});
const productSchema=z.object({brandId:z.string(),name:z.string().trim().min(2).max(160),category:z.string().trim().min(2).max(120),description:z.string().trim().min(10).max(5000),keyFeatures:z.string().trim().min(3).max(3000),price:z.string().trim().min(1).max(80)});

export async function createBrand(formData:FormData){const input=brandSchema.parse(Object.fromEntries(formData));const {workspace}=await requireWorkspace();await getDb().brand.create({data:{workspaceId:workspace.id,...input}});revalidatePath("/catalog")}
export async function createProduct(formData:FormData){const input=productSchema.parse(Object.fromEntries(formData));const {workspace}=await requireWorkspace();const brand=await getDb().brand.findFirst({where:{id:input.brandId,workspaceId:workspace.id}});if(!brand)throw new Error("Brand not found.");await getDb().product.create({data:input});revalidatePath("/catalog")}
export async function createLaunchFromProduct(formData:FormData){const productId=z.string().parse(formData.get("productId"));const {workspace}=await requireWorkspace();const product=await getDb().product.findFirst({where:{id:productId,brand:{workspaceId:workspace.id}}});if(!product)throw new Error("Product not found.");const launch=await getDb().launch.create({data:{workspaceId:workspace.id,productId,name:`${product.name} launch`,status:"READY"}});redirect(`/launches/${launch.id}`)}
