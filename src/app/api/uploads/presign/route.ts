import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizeLaunch } from "@/lib/auth";
import { createPresignedUpload, validateUpload } from "@/lib/uploads";
import { rateLimit } from "@/lib/rate-limit";

const schema=z.object({launchId:z.string().min(1),fileName:z.string().min(1).max(255),mimeType:z.string(),size:z.number().int().positive()});
export async function POST(request:Request){
  try{
    const input=schema.parse(await request.json());
    const {launch}=await authorizeLaunch(input.launchId);
    if(!rateLimit(`upload:${launch.workspaceId}`,30,60_000))throw new Error("Too many upload requests. Try again shortly.");
    const key=`products/${launch.productId}/${validateUpload(input.fileName,input.mimeType,input.size)}`;
    const signed=await createPresignedUpload(key,input.mimeType);
    return NextResponse.json({...signed,key});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Invalid upload."},{status:400});}
}
