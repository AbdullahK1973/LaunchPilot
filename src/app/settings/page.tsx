import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { requireWorkspace } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { saveIntegration, updateWorkspace } from "@/app/actions/settings";

export default async function SettingsPage(){
  const {workspace}=await requireWorkspace();const integrations=await getDb().integration.findMany({where:{workspaceId:workspace.id}});
  return <DashboardShell title="Settings" description="Workspace defaults and export destinations."><div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
    <Card className="p-6"><h2 className="text-xl font-semibold">Workspace</h2><form action={updateWorkspace} className="mt-5 space-y-4"><Field label="Name"><Input name="name" defaultValue={workspace.name} required/></Field><Field label="Default tone"><Input name="defaultTone" defaultValue={workspace.defaultTone} required/></Field><Button>Save settings</Button></form></Card>
    <Card className="p-6"><h2 className="text-xl font-semibold">Integrations</h2><p className="mt-2 text-sm text-slate-600">Store a destination for future publishing workflows. Secrets should be supplied through environment-managed provider OAuth in production.</p><form action={saveIntegration} className="mt-5 space-y-4"><Field label="Provider"><Select name="provider"><option value="shopify">Shopify</option><option value="klaviyo">Klaviyo</option><option value="webhook">Webhook</option></Select></Field><Field label="Label"><Input name="label" placeholder="Production store" required/></Field><Field label="Endpoint"><Input name="endpoint" type="url" placeholder="https://…"/></Field><Button>Connect destination</Button></form><ul className="mt-5 space-y-2">{integrations.map(i=><li key={i.id} className="rounded-lg bg-slate-50 p-3 text-sm font-semibold">{i.label} · {i.provider}</li>)}</ul></Card>
  </div></DashboardShell>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>}
