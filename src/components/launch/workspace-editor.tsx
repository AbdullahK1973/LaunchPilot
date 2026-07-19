"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Download, RefreshCw, Save } from "lucide-react";
import { generateOutput } from "@/app/actions/launches";
import { OutputCard } from "@/components/launch/output-card";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { LaunchActionId, OutputSection } from "@/types/launch";

export function WorkspaceEditor({ launchId, actionId, initialSections, initialNote }: { launchId: string; actionId: LaunchActionId; initialSections: OutputSection[]; initialNote: string }) {
  const [sections,setSections]=useState(initialSections);
  const [note,setNote]=useState(initialNote);
  const [error,setError]=useState("");
  const [pending,startTransition]=useTransition();
  function run(){setError("");startTransition(async()=>{try{const result=await generateOutput(launchId,actionId,note,sections.length?sections:undefined);setSections(result.sections);}catch(e){setError(e instanceof Error?e.message:"Generation failed.");}})}
  const exportHref=`data:text/markdown;charset=utf-8,${encodeURIComponent(sections.map(s=>`## ${s.title}\n\n${Array.isArray(s.body)?s.body.map(x=>`- ${x}`).join("\n"):s.body}`).join("\n\n"))}`;
  return <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_360px]">
    <div className="space-y-4">{sections.length?sections.map((section,index)=><OutputCard key={`${section.title}-${index}`} section={section} onChange={(next)=>setSections(current=>current.map((item,i)=>i===index?next:item))}/>):<Card className="p-10 text-center text-slate-600">Generate the first version of this asset.</Card>}</div>
    <aside><Card className="sticky top-28 p-5"><h2 className="text-lg font-semibold">Refinement notes</h2><Textarea className="mt-4" value={note} onChange={e=>setNote(e.target.value)} placeholder="Make it more specific, concise, or conversion-focused…"/>{error?<p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>:null}<div className="mt-4 grid gap-3"><Button onClick={run} disabled={pending}>{pending?<RefreshCw className="animate-spin" size={16}/>:<Save size={16}/>} {sections.length?"Save new revision":"Generate output"}</Button>{sections.length?<a className={buttonClasses("secondary")} href={exportHref} download={`${actionId}.md`}><Download size={16}/>Export Markdown</a>:null}<Link href={`/launches/${launchId}`} className={buttonClasses("ghost")}>Back to launch</Link></div></Card></aside>
  </div>;
}
