"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Gem, Goal, Package, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sampleLaunch } from "@/data/mock-launch";
import { getLaunch } from "@/lib/launch-storage";
import type { LaunchFormData } from "@/types/launch";

export default function SummaryPage() {
  const [launch, setLaunch] = useState<LaunchFormData>(sampleLaunch);

  useEffect(() => {
    const timer = window.setTimeout(() => setLaunch(getLaunch()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const summaryItems = [
    { label: "What the brand sells", value: `${launch.brandName} sells ${launch.productCategory.toLowerCase()} products, led by ${launch.productName}.`, icon: Package },
    { label: "Target customer", value: launch.targetAudience, icon: Users },
    { label: "Product angle", value: launch.specialNotes || launch.productDescription, icon: Gem },
    { label: "Brand tone", value: launch.brandTone || "Premium", icon: BadgeDollarSign },
    { label: "Launch goal", value: launch.launchGoal, icon: Goal },
  ];

  return (
    <DashboardShell
      title="LaunchPilot Business Summary"
      description="A structured snapshot of the product launch inputs before LaunchPilot generates actions."
    >
      <div className="mx-auto max-w-6xl">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 bg-white p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">Current launch</p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{launch.productName}</h2>
                <p className="mt-2 text-slate-600">
                  {launch.brandName} · {launch.price} · {launch.productCategory}
                </p>
              </div>
              <Link href="/actions" className={buttonClasses("primary")}>
                Continue to Launch Actions
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            {summaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="border-b border-slate-200 p-6 last:border-b-0 md:border-r md:last:border-r-0">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-700">
                      <Icon size={19} />
                    </span>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{item.label}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-700">{item.value}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
