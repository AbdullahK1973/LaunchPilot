import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireWorkspace } from "@/lib/auth";
import { getEntitlements } from "@/lib/entitlements";
import { openBillingPortal, startCheckout } from "@/app/actions/billing";

export default async function BillingPage(){
  const {workspace}=await requireWorkspace();const entitlement=await getEntitlements(workspace.id);
  return <DashboardShell title="Billing and usage" description="Subscription entitlements are enforced on every generation."><Card className="mx-auto max-w-3xl p-8"><p className="text-xs font-bold uppercase text-sky-700">{entitlement.plan} plan</p><h2 className="mt-2 text-3xl font-semibold">{entitlement.used} / {entitlement.limit}</h2><p className="mt-2 text-slate-600">generations used this calendar month</p><div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-sky-600" style={{width:`${Math.min(100,(entitlement.used/entitlement.limit)*100)}%`}}/></div><div className="mt-8 flex flex-wrap gap-3">{entitlement.plan==="FREE"?<form action={startCheckout}><Button>Upgrade to Pro</Button></form>:<form action={openBillingPortal}><Button variant="secondary">Manage subscription</Button></form>}</div></Card></DashboardShell>;
}
