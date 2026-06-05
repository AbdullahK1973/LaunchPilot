import { CreditCard } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <DashboardShell
      title="LaunchPilot Billing"
      description="A starter billing screen for plan, usage, and checkout integration."
    >
      <Card className="mx-auto max-w-4xl p-8">
        <div className="grid size-12 place-items-center rounded-lg bg-slate-100 text-slate-700">
          <CreditCard size={22} />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Starter plan</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          LaunchPilot billing is ready to connect to Stripe or Shopify billing when backend work begins.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["5 demo launches", "Mock AI outputs", "Workspace editing"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
