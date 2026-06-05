import { Settings } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <DashboardShell
      title="LaunchPilot Settings"
      description="Starter account and brand defaults for future authenticated workspaces."
    >
      <Card className="mx-auto max-w-4xl p-8">
        <div className="grid size-12 place-items-center rounded-lg bg-slate-100 text-slate-700">
          <Settings size={22} />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Workspace defaults</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Workspace Name</span>
            <Input defaultValue="LaunchPilot Demo Workspace" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Default Brand Tone</span>
            <Input defaultValue="Premium" />
          </label>
        </div>
      </Card>
    </DashboardShell>
  );
}
