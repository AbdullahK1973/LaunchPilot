import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizeLaunch } from "@/lib/auth";
import { getDb } from "@/lib/db";

const schema=z.object({launchId:z.string(),key:z.string(),url:z.url(),fileName:z.string(),mimeType:z.string(),size:z.number().int()});
export async function POST(request:Request){
  try{const input=schema.parse(await request.json());const {launch}=await authorizeLaunch(input.launchId);const image=await getDb().productImage.create({data:{productId:launch.productId,key:input.key,url:input.url,fileName:input.fileName,mimeType:input.mimeType,size:input.size}});return NextResponse.json(image);}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Upload confirmation failed."},{status:400});}
}
