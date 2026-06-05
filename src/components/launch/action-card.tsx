import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import type { LaunchAction } from "@/types/launch";

type ActionCardProps = {
  action: LaunchAction;
  icon: LucideIcon;
};

export function ActionCard({ action, icon: Icon }: ActionCardProps) {
  return (
    <Card className="group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/80">
      <div className="flex size-12 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-100">
        <Icon size={22} />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">{action.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{action.description}</p>
      <Link href={`/workspace?action=${action.id}`} className={buttonClasses("secondary", "mt-6 w-full")}>
        {action.buttonLabel}
        <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
      </Link>
    </Card>
  );
}
