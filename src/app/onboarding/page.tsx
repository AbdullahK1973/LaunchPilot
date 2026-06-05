"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sampleLaunch } from "@/data/mock-launch";
import { saveLaunch } from "@/lib/launch-storage";
import type { LaunchFormData } from "@/types/launch";

const requiredFields: Array<keyof LaunchFormData> = [
  "brandName",
  "brandTone",
  "targetAudience",
  "launchGoal",
  "productName",
  "productCategory",
  "productDescription",
  "keyFeatures",
  "price",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<LaunchFormData>(sampleLaunch);
  const [errors, setErrors] = useState<Partial<Record<keyof LaunchFormData, string>>>({});

  function updateField(field: keyof LaunchFormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitLaunch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof LaunchFormData, string>> = {};
    requiredFields.forEach((field) => {
      const value = form[field];
      if (typeof value === "string" && value.trim().length < 2) {
        nextErrors[field] = "Required";
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    saveLaunch(form);
    router.push("/summary");
  }

  return (
    <DashboardShell
      title="LaunchPilot Product Onboarding"
      description="Capture the product and brand inputs LaunchPilot needs for a useful first launch pass."
    >
      <form onSubmit={submitLaunch} className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">Business Info</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Brand Name" error={errors.brandName}>
                <Input value={form.brandName} onChange={(e) => updateField("brandName", e.target.value)} />
              </Field>
              <Field label="Brand Tone" error={errors.brandTone}>
                <Select value={form.brandTone} onChange={(e) => updateField("brandTone", e.target.value)}>
                  <option value="">Select tone</option>
                  <option>Premium</option>
                  <option>Friendly</option>
                  <option>Bold</option>
                  <option>Clinical</option>
                  <option>Playful</option>
                </Select>
              </Field>
              <Field label="Target Audience" error={errors.targetAudience} className="md:col-span-2">
                <Textarea value={form.targetAudience} onChange={(e) => updateField("targetAudience", e.target.value)} />
              </Field>
              <Field label="Main Launch Goal" error={errors.launchGoal} className="md:col-span-2">
                <Textarea value={form.launchGoal} onChange={(e) => updateField("launchGoal", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">Product Info</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Product Name" error={errors.productName}>
                <Input value={form.productName} onChange={(e) => updateField("productName", e.target.value)} />
              </Field>
              <Field label="Product Category" error={errors.productCategory}>
                <Input value={form.productCategory} onChange={(e) => updateField("productCategory", e.target.value)} />
              </Field>
              <Field label="Product Description" error={errors.productDescription} className="md:col-span-2">
                <Textarea
                  value={form.productDescription}
                  onChange={(e) => updateField("productDescription", e.target.value)}
                />
              </Field>
              <Field label="Key Features" error={errors.keyFeatures} className="md:col-span-2">
                <Textarea value={form.keyFeatures} onChange={(e) => updateField("keyFeatures", e.target.value)} />
              </Field>
              <Field label="Price" error={errors.price}>
                <Input value={form.price} onChange={(e) => updateField("price", e.target.value)} />
              </Field>
              <Field label="Product Images Upload">
                <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  <UploadCloud size={17} />
                  Upload images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        imageNames: Array.from(e.target.files ?? []).map((file) => file.name),
                      }))
                    }
                  />
                </label>
              </Field>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">Optional Context</h2>
            <div className="mt-6 space-y-5">
              <Field label="Competitor Product Link">
                <Input
                  value={form.competitorLink ?? ""}
                  onChange={(e) => updateField("competitorLink", e.target.value)}
                />
              </Field>
              <Field label="Existing Product Page URL">
                <Input
                  value={form.existingProductUrl ?? ""}
                  onChange={(e) => updateField("existingProductUrl", e.target.value)}
                />
              </Field>
              <Field label="Notes about what makes the product special">
                <Textarea
                  value={form.specialNotes ?? ""}
                  onChange={(e) => updateField("specialNotes", e.target.value)}
                />
              </Field>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">LaunchPilot Intake Status</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>{form.imageNames.length || 0} product image file names attached.</p>
              <p>Required fields are validated before LaunchPilot builds the summary.</p>
            </div>
            <Button type="submit" className="mt-6 w-full">
              Generate Business Summary
            </Button>
          </Card>
        </aside>
      </form>
    </DashboardShell>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
        {label}
        {error ? <span className="text-xs font-bold text-rose-600">{error}</span> : null}
      </span>
      {children}
    </label>
  );
}
