import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { authorizeLaunch } from "@/lib/auth";
import { launchActions } from "@/data/mock-launch";
import { ImageUpload } from "@/components/launch/image-upload";

export default async function LaunchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { launch } = await authorizeLaunch(id);
  return <DashboardShell title={launch.name} description={`${launch.product.brand.name} · ${launch.product.category} · ${launch.product.price}`}>
    <div className="mx-auto max-w-6xl">
      <Card className="mb-6 p-6"><h2 className="text-xl font-semibold">{launch.product.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{launch.product.description}</p><div className="mt-4 flex flex-wrap items-center gap-2"><span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold">{launch.product.brand.tone}</span><span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold">{launch.product.images.length} images</span><ImageUpload launchId={launch.id}/></div></Card>
      <div className="grid gap-5 md:grid-cols-2">{launchActions.map((action) => { const output = launch.outputs.find((item) => item.actionId === action.id); return <Card key={action.id} className="p-6"><h2 className="text-lg font-semibold">{action.title}</h2><p className="mt-2 text-sm text-slate-600">{action.description}</p><Link href={`/workspace?launch=${launch.id}&action=${action.id}`} className={buttonClasses(output ? "secondary" : "primary","mt-6 w-full")}>{output ? `Open revision ${output.revisions[0]?.version ?? 1}` : action.buttonLabel}</Link></Card>; })}</div>
    </div>
  </DashboardShell>;
}
