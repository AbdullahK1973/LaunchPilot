import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { requireWorkspace } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function HistoryPage(){
  const {workspace}=await requireWorkspace();
  const outputs=await getDb().output.findMany({where:{launch:{workspaceId:workspace.id}},include:{launch:{include:{product:true}},revisions:{orderBy:{version:"desc"},take:1}},orderBy:{updatedAt:"desc"},take:100});
  return <DashboardShell title="Output history" description="Every generated asset and its latest saved revision."><div className="mx-auto max-w-5xl space-y-4">{outputs.length===0?<Card className="p-8 text-slate-600">No outputs yet.</Card>:outputs.map(output=><Card key={output.id} className="p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase text-sky-700">{output.actionId}</p><h2 className="mt-1 text-lg font-semibold">{output.launch.product.name}</h2><p className="text-sm text-slate-500">Revision {output.revisions[0]?.version} · {output.updatedAt.toLocaleString()}</p></div><Link className={buttonClasses("secondary")} href={`/workspace?launch=${output.launchId}&action=${output.actionId}`}>Open</Link></div></Card>)}</div></DashboardShell>;
}
