"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Save, SlidersHorizontal } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OutputCard } from "@/components/launch/output-card";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { launchActions, mockOutputs } from "@/data/mock-launch";
import { saveOutput } from "@/lib/output-storage";
import type { LaunchActionId, OutputSection } from "@/types/launch";

const validActionIds = ["listing", "positioning", "campaign", "creative"] satisfies LaunchActionId[];

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <DashboardShell title="LaunchPilot Workspace" description="Preparing generated launch output.">
          <Card className="mx-auto max-w-4xl p-8 text-sm font-semibold text-slate-600">Loading workspace...</Card>
        </DashboardShell>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const actionId = validActionIds.includes(actionParam as LaunchActionId)
    ? (actionParam as LaunchActionId)
    : "listing";
  const action = launchActions.find((item) => item.id === actionId) ?? launchActions[0];

  return <WorkspaceEditor key={actionId} actionId={actionId} action={action} />;
}

function WorkspaceEditor({
  actionId,
  action,
}: {
  actionId: LaunchActionId;
  action: (typeof launchActions)[number];
}) {
  const [note, setNote] = useState("Tighten the tone for a premium Shopify product page and keep the language benefit-led.");
  const [sections, setSections] = useState<OutputSection[]>(() => mockOutputs[actionId]);
  const [revision, setRevision] = useState(1);
  const [saved, setSaved] = useState(false);

  function updateSection(index: number, nextSection: OutputSection) {
    setSections((current) => current.map((section, sectionIndex) => (sectionIndex === index ? nextSection : section)));
    setSaved(false);
  }

  function regenerateOutput() {
    setRevision((current) => current + 1);
    setSections((current) =>
      current.map((section, index) => ({
        ...section,
        body: transformBody(section.body, `Variant ${revision + 1}`, index),
      })),
    );
    setSaved(false);
  }

  function refineOutput() {
    setSections((current) =>
      current.map((section, index) => ({
        ...section,
        body: transformBody(section.body, "Refined with stronger audience specificity", index),
      })),
    );
    setNote(`${note}\n\nRefined for clearer audience specificity and stronger CTA.`);
    setSaved(false);
  }

  function saveCurrentOutput() {
    saveOutput({
      actionId,
      actionTitle: action.title,
      sections,
      note,
    });
    setSaved(true);
  }

  return (
    <DashboardShell
      title={`LaunchPilot Workspace: ${action.title}`}
      description="Review generated launch output, edit notes, and save the direction for this product launch."
    >
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <OutputCard
              key={section.title}
              section={section}
              onChange={(nextSection) => updateSection(index, nextSection)}
            />
          ))}
        </div>
        <aside className="space-y-5">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-slate-950">Editable Refinement Notes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add direction before regenerating or refining LaunchPilot output.
            </p>
            <Textarea className="mt-4" value={note} onChange={(event) => setNote(event.target.value)} />
            <div className="mt-4 grid gap-3">
              <Button type="button" onClick={regenerateOutput}>
                <RefreshCw size={16} />
                Regenerate
              </Button>
              <Button type="button" variant="secondary" onClick={saveCurrentOutput}>
                <Save size={16} />
                Save
              </Button>
              <Button type="button" variant="secondary" onClick={refineOutput}>
                <SlidersHorizontal size={16} />
                Refine
              </Button>
              <Link href="/actions" className={buttonClasses("ghost")}>
                <ArrowLeft size={16} />
                Back to Actions
              </Link>
            </div>
            {saved ? (
              <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                Saved to LaunchPilot History.
              </p>
            ) : null}
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Selected action</h2>
            <p className="mt-3 text-lg font-semibold text-slate-950">{action.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}

function transformBody(body: OutputSection["body"], label: string, index: number) {
  const suffix = index === 0 ? label : `${label}.`;

  if (Array.isArray(body)) {
    return body.map((item) => `${item} (${suffix})`);
  }

  return `${body}\n\n${suffix}`;
}
