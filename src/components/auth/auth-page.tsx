import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AuthPage({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-slate-50 px-4"><Card className="w-full max-w-md p-8"><Link href="/" className="mb-8 flex items-center gap-3 font-bold"><span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white"><Sparkles size={18}/></span>LaunchPilot</Link><h1 className="text-3xl font-semibold">{title}</h1><p className="mb-7 mt-2 text-sm text-slate-600">{description}</p>{children}</Card></main>;
}
