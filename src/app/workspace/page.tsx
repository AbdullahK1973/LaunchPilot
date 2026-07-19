import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WorkspaceEditor } from "@/components/launch/workspace-editor";
import { authorizeLaunch } from "@/lib/auth";
import { launchActions } from "@/data/mock-launch";
import type { LaunchActionId, OutputSection } from "@/types/launch";

const valid=["listing","positioning","campaign","creative"] as LaunchActionId[];
export default async function WorkspacePage({searchParams}:{searchParams:Promise<{launch?:string;action?:string}>}){
  const params=await searchParams;
  if(!params.launch) throw new Error("A launch is required.");
  const actionId=valid.includes(params.action as LaunchActionId)?params.action as LaunchActionId:"listing";
  const {launch}=await authorizeLaunch(params.launch);
  const action=launchActions.find(item=>item.id===actionId)!;
  const output=launch.outputs.find(item=>item.actionId===actionId);
  const revision=output?.revisions[0];
  return <DashboardShell title={action.title} description={`${launch.product.name} · revisions are saved automatically`}>
    <WorkspaceEditor launchId={launch.id} actionId={actionId} initialSections={(revision?.sections as unknown as OutputSection[])??[]} initialNote={output?.note??""}/>
  </DashboardShell>;
}
