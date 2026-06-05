import { BadgeCheck, Megaphone, PenLine, ScanSearch } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ActionCard } from "@/components/launch/action-card";
import { launchActions } from "@/data/mock-launch";
import type { LaunchActionId } from "@/types/launch";

const icons = {
  listing: PenLine,
  positioning: ScanSearch,
  campaign: Megaphone,
  creative: BadgeCheck,
} satisfies Record<LaunchActionId, typeof PenLine>;

export default function ActionsPage() {
  return (
    <DashboardShell
      title="LaunchPilot Launch Actions"
      description="Choose the next asset LaunchPilot should generate for this ecommerce product launch."
    >
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {launchActions.map((action) => (
          <ActionCard key={action.id} action={action} icon={icons[action.id]} />
        ))}
      </div>
    </DashboardShell>
  );
}
