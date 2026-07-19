"use client";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export function ImageUpload({launchId}:{launchId:string}){
  const [status,setStatus]=useState("");
  async function upload(file:File){
    setStatus("Preparing upload…");
    const presign=await fetch("/api/uploads/presign",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({launchId,fileName:file.name,mimeType:file.type,size:file.size})});
    const signed=await presign.json();if(!presign.ok){setStatus(signed.error);return;}
    setStatus("Uploading…");const sent=await fetch(signed.uploadUrl,{method:"PUT",headers:{"content-type":file.type},body:file});if(!sent.ok){setStatus("Upload failed.");return;}
    const confirmed=await fetch("/api/uploads/confirm",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({launchId,key:signed.key,fileName:file.name,mimeType:file.type,size:file.size})});
    const result=await confirmed.json();if(!confirmed.ok){setStatus(result.error||"Upload verification failed.");return;}
    setStatus("Image attached. Refresh to see it.");window.location.reload();
  }
  return <div><label><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0])}/><span className={buttonClasses("secondary")}><UploadCloud size={16}/>Attach product image</span></label>{status?<p aria-live="polite" className="mt-2 text-xs text-slate-600">{status}</p>:null}</div>;
}
