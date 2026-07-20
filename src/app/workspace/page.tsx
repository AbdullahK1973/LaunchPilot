import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WorkspaceEditor } from "@/components/launch/workspace-editor";
import { authorizeLaunch } from "@/lib/auth";
import { launchActions } from "@/data/mock-launch";
import type { LaunchActionId, OutputSection } from "@/types/launch";
import { getDb } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { addComment, resolveComment } from "@/app/actions/collaboration";
import { publishRevision } from "@/app/actions/publishing";
const valid=["listing","positioning","campaign","creative"] as LaunchActionId[];
export default async function WorkspacePage({searchParams}:{searchParams:Promise<{launch?:string;action?:string}>}){
  const params=await searchParams;if(!params.launch)throw new Error("A launch is required.");
  const actionId=valid.includes(params.action as LaunchActionId)?params.action as LaunchActionId:"listing";
  const {launch}=await authorizeLaunch(params.launch),action=launchActions.find(item=>item.id===actionId)!,output=launch.outputs.find(item=>item.actionId===actionId),revision=output?.revisions[0];
  const integrations=await getDb().integration.findMany({where:{workspaceId:launch.workspaceId,enabled:true}});
  return <DashboardShell title={action.title} description={`${launch.product.name} · revisions are saved automatically`}>
    <WorkspaceEditor launchId={launch.id} actionId={actionId} initialSections={(revision?.sections as unknown as OutputSection[])??[]} initialNote={output?.note??""}/>
    {revision?<div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-2"><Card className="p-6"><h2 className="text-lg font-semibold">Revision history and exports</h2><div className="mt-4 space-y-3">{output?.revisions.map(r=><div key={r.id} className="rounded-lg border p-3"><p className="font-semibold">Version {r.version}</p><p className="text-xs text-slate-500">{r.createdAt.toLocaleString()} · {r.model||"manual"}</p><div className="mt-2 flex flex-wrap gap-3">{["markdown","html","json","csv"].map(f=><a key={f} className="text-sm font-semibold text-sky-700" href={`/api/outputs/${r.id}/export?format=${f}`}>{f.toUpperCase()}</a>)}</div></div>)}</div>{integrations.length?<form action={publishRevision} className="mt-5 flex gap-3"><input type="hidden" name="revisionId" value={revision.id}/><Select name="integrationId">{integrations.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</Select><Button>Publish draft</Button></form>:<p className="mt-4 text-sm text-slate-500">Connect a publishing destination in Settings.</p>}</Card><Card className="p-6"><h2 className="text-lg font-semibold">Collaboration</h2><div className="mt-4 space-y-3">{revision.comments.map(c=><div key={c.id} className={`rounded-lg p-3 ${c.resolvedAt?"bg-slate-100 opacity-60":"bg-sky-50"}`}><p className="text-sm">{c.body}</p><p className="mt-1 text-xs text-slate-500">{c.author.name}</p><form action={resolveComment} className="mt-2"><input type="hidden" name="commentId" value={c.id}/><Button variant="ghost">{c.resolvedAt?"Reopen":"Resolve"}</Button></form></div>)}</div><form action={addComment} className="mt-4 flex gap-3"><input type="hidden" name="revisionId" value={revision.id}/><Input name="body" placeholder="Add feedback…" required/><Button>Comment</Button></form></Card></div>:null}
  </DashboardShell>;
}
