import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizeLaunch } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { verifyStoredUpload } from "@/lib/uploads";

const schema=z.object({launchId:z.string(),key:z.string(),fileName:z.string().min(1).max(255),mimeType:z.enum(["image/jpeg","image/png","image/webp"]),size:z.number().int().positive().max(10*1024*1024)});
export async function POST(request:Request){
  try{const input=schema.parse(await request.json());const {launch}=await authorizeLaunch(input.launchId);const url=await verifyStoredUpload(launch.productId,input.key,input.mimeType,input.size);const image=await getDb().productImage.create({data:{productId:launch.productId,key:input.key,url,fileName:input.fileName,mimeType:input.mimeType,size:input.size}});return NextResponse.json(image);}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Upload confirmation failed."},{status:400});}
}
