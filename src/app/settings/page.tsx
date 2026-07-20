import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { requireWorkspace } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { saveIntegration, updateWorkspace } from "@/app/actions/settings";
import { createWorkspace, switchWorkspace } from "@/app/actions/workspace";

export default async function SettingsPage(){
  const {workspace,user}=await requireWorkspace();
  const integrations=await getDb().integration.findMany({where:{workspaceId:workspace.id}});
  return <DashboardShell title="Settings" description="Workspace defaults, switching, and encrypted publishing destinations."><div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
    <Card className="p-6"><h2 className="text-xl font-semibold">Workspace</h2><form action={updateWorkspace} className="mt-5 space-y-4"><Field label="Name"><Input name="name" defaultValue={workspace.name} required/></Field><Field label="Default tone"><Input name="defaultTone" defaultValue={workspace.defaultTone} required/></Field><Button>Save settings</Button></form><form action={switchWorkspace} className="mt-6 space-y-3"><Field label="Switch workspace"><Select name="workspaceId" defaultValue={workspace.id}>{user.memberships.map(m=><option key={m.workspaceId} value={m.workspaceId}>{m.workspace.name}</option>)}</Select></Field><Button variant="secondary">Switch</Button></form><form action={createWorkspace} className="mt-6 space-y-3"><Field label="Create workspace"><Input name="name" required/></Field><Button variant="secondary">Create</Button></form></Card>
    <Card className="p-6"><h2 className="text-xl font-semibold">Publishing integrations</h2><p className="mt-2 text-sm text-slate-600">Credentials are encrypted at rest. Shopify creates draft products, Klaviyo creates campaign drafts, and webhooks receive signed payloads.</p><form action={saveIntegration} className="mt-5 space-y-4"><Field label="Provider"><Select name="provider"><option value="shopify">Shopify</option><option value="klaviyo">Klaviyo</option><option value="webhook">Webhook</option></Select></Field><Field label="Label"><Input name="label" placeholder="Production store" required/></Field><Field label="Store domain / webhook URL"><Input name="endpoint" placeholder="store.myshopify.com" required/></Field><Field label="Admin token / API key / signing secret"><Input name="secret" type="password" required/></Field><Field label="Klaviyo list ID"><Input name="listId"/></Field><Button>Connect destination</Button></form><ul className="mt-5 space-y-2">{integrations.map(i=><li key={i.id} className="rounded-lg bg-slate-50 p-3 text-sm font-semibold">{i.label} · {i.provider}{i.lastError?<span className="block text-xs text-rose-600">{i.lastError}</span>:null}</li>)}</ul></Card>
  </div></DashboardShell>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>}
