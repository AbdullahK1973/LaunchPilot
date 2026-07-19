import Link from "next/link";
import { ArrowRight, PackagePlus, Rocket } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireWorkspace } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getEntitlements } from "@/lib/entitlements";

export default async function SummaryPage() {
  const { workspace } = await requireWorkspace();
  const [launches, entitlement] = await Promise.all([
    getDb().launch.findMany({ where: { workspaceId: workspace.id, status: { not: "ARCHIVED" } }, include: { product: { include: { brand: true } }, outputs: true }, orderBy: { updatedAt: "desc" } }),
    getEntitlements(workspace.id),
  ]);
  return <DashboardShell title={workspace.name} description={`${entitlement.used} of ${entitlement.limit} monthly generations used on the ${entitlement.plan.toLowerCase()} plan.`}>
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex justify-end"><Link href="/onboarding" className={buttonClasses("primary")}><PackagePlus size={16}/>New launch</Link></div>
      {launches.length === 0 ? <Card className="p-10 text-center"><Rocket className="mx-auto text-slate-400"/><h2 className="mt-4 text-2xl font-semibold">Create your first launch</h2><p className="mt-2 text-slate-600">Add a product, its audience, and launch goal to begin.</p><Link href="/onboarding" className={buttonClasses("primary","mt-6")}>Start onboarding</Link></Card> :
      <div className="grid gap-5 md:grid-cols-2">{launches.map((launch) => <Card key={launch.id} className="p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-sky-700">{launch.status}</p><h2 className="mt-2 text-xl font-semibold">{launch.name}</h2><p className="mt-2 text-sm text-slate-600">{launch.product.brand.name} · {launch.product.price} · {launch.product.category}</p></div><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold">{launch.outputs.length} outputs</span></div><Link href={`/launches/${launch.id}`} className={buttonClasses("secondary","mt-6 w-full")}>Open launch<ArrowRight size={16}/></Link></Card>)}</div>}
    </div>
  </DashboardShell>;
}
