"use client";

import { useActionState } from "react";
import { createLaunch, type FormState } from "@/app/actions/launches";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OnboardingPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(createLaunch, {});
  return <DashboardShell title="New product launch" description="Capture the product and audience context used by every generated asset.">
    <form action={action} className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-2">
      <Card className="space-y-5 p-6"><h2 className="text-lg font-semibold">Brand and audience</h2>
        <Field label="Brand name"><Input name="brandName" required minLength={2}/></Field>
        <Field label="Brand tone"><Select name="brandTone" required defaultValue="Premium">{["Premium","Friendly","Bold","Clinical","Playful"].map((tone)=><option key={tone}>{tone}</option>)}</Select></Field>
        <Field label="Target audience"><Textarea name="targetAudience" required minLength={10}/></Field>
        <Field label="Launch goal"><Textarea name="launchGoal" required minLength={10}/></Field>
      </Card>
      <Card className="space-y-5 p-6"><h2 className="text-lg font-semibold">Product</h2>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Product name"><Input name="productName" required/></Field><Field label="Category"><Input name="productCategory" required/></Field></div>
        <Field label="Description"><Textarea name="productDescription" required minLength={10}/></Field>
        <Field label="Key features"><Textarea name="keyFeatures" required/></Field>
        <Field label="Price"><Input name="price" required/></Field>
        <Field label="Competitor URL"><Input name="competitorLink" type="url"/></Field>
        <Field label="Existing product URL"><Input name="existingProductUrl" type="url"/></Field>
        <Field label="Special notes"><Textarea name="specialNotes"/></Field>
        {state.error ? <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{state.error}</p> : null}
        <Button className="w-full" disabled={pending}>{pending ? "Creating…" : "Create launch"}</Button>
      </Card>
    </form>
  </DashboardShell>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>}
