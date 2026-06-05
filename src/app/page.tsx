import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileText, Sparkles, Target, Wand2, Zap } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  { title: "Upload the context", description: "Add brand details, product notes, images, pricing, and launch goals.", icon: ClipboardCheck },
  { title: "Choose the launch task", description: "Pick listing copy, positioning, campaign content, or ad concepts.", icon: Target },
  { title: "Refine the output", description: "Edit, regenerate, and save direction inside a focused launch workspace.", icon: FileText },
];

const features = [
  "Shopify listing copy foundations",
  "Audience and positioning angles",
  "Launch email, social, and ad copy",
  "Creative direction for paid campaigns",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white">
            <Sparkles size={19} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-950">LaunchPilot</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <a href="#how-it-works" className="hover:text-slate-950">How it works</a>
          <a href="#features" className="hover:text-slate-950">Features</a>
          <Link href="/summary" className="hover:text-slate-950">Dashboard</Link>
        </div>
        <Link href="/onboarding" className={buttonClasses("secondary", "hidden md:inline-flex")}>
          Start
        </Link>
      </nav>

      <section className="border-y border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_78%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-800">
              <Zap size={15} />
              AI launch assistant for DTC sellers
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Launch your ecommerce product with AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              LaunchPilot helps ecommerce sellers upload product details, brand info, and images to get tailored launch
              strategies, listing copy, and campaign directions in minutes.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding" className={buttonClasses("primary", "px-6")}>
                Start Your Product Launch
                <ArrowRight size={17} />
              </Link>
              <Link href="/actions" className={buttonClasses("secondary", "px-6")}>
                View launch actions
              </Link>
            </div>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
              <p className="text-sm font-semibold">LaunchPilot workspace</p>
              <p className="mt-1 text-xs text-slate-300">Radiance Reset Serum launch plan</p>
            </div>
            <div className="space-y-4 p-5">
              {features.map((feature, index) => (
                <div key={feature} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{feature}</span>
                  </div>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Ready</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader
          eyebrow="How it works"
          title="A launch workflow built for momentum"
          description="LaunchPilot turns scattered product inputs into structured launch assets you can edit and ship."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="p-6">
                <div className="grid size-11 place-items-center rounded-lg bg-slate-950 text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="features" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            eyebrow="Features"
            title="Premium launch assets without a blank page"
            description="A clean SaaS foundation with real routing, state, reusable components, and editable launch outputs."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <Wand2 size={18} className="text-sky-700" />
                <span className="font-semibold text-slate-800">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-slate-700">LaunchPilot</p>
          <p>AI ecommerce product launch assistant for small Shopify and DTC sellers.</p>
        </div>
      </footer>
    </main>
  );
}
