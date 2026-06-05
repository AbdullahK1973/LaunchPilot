import { DashboardShell } from "@/components/layout/dashboard-shell";
import { HistoryList } from "@/components/launch/history-list";

export default function HistoryPage() {
  return (
    <DashboardShell
      title="LaunchPilot History"
      description="Saved launch outputs will appear here as the MVP grows into a connected workspace."
    >
      <div className="mx-auto max-w-5xl space-y-5">
        <HistoryList />
      </div>
    </DashboardShell>
  );
}
