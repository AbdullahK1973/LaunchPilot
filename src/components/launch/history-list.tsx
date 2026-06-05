"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { OutputCard } from "@/components/launch/output-card";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSavedOutputs } from "@/lib/output-storage";
import type { SavedLaunchOutput } from "@/types/launch";

export function HistoryList() {
  const [outputs, setOutputs] = useState<SavedLaunchOutput[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setOutputs(getSavedOutputs()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (outputs.length === 0) {
    return (
      <Card className="p-8">
        <div className="grid size-12 place-items-center rounded-lg bg-slate-100 text-slate-700">
          <Clock3 size={22} />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Recent LaunchPilot outputs</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Saved launch outputs will appear here after you complete an action in the workspace.
        </p>
        <Link href="/actions" className={buttonClasses("primary", "mt-6")}>
          Create a launch output
        </Link>
      </Card>
    );
  }

  return (
    <>
      {outputs.map((output) => (
        <Card key={output.id} className="p-5">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{output.actionTitle}</h2>
              <p className="text-sm text-slate-500">Saved {new Date(output.savedAt).toLocaleString()}</p>
            </div>
            <Link href={`/workspace?action=${output.actionId}`} className={buttonClasses("secondary")}>
              Reopen action
            </Link>
          </div>
          <div className="mt-4 grid gap-4">
            {output.sections.slice(0, 2).map((section) => (
              <OutputCard key={section.title} section={section} />
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}
