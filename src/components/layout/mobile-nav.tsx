"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
const items=[["/summary","Dashboard"],["/history","History"],["/billing","Billing"],["/settings","Settings"]];
export function MobileNav(){return <details className="relative lg:hidden"><summary aria-label="Open navigation" className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-slate-200"><Menu size={18}/></summary><nav className="absolute left-0 top-12 z-30 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">{items.map(([href,label])=><Link key={href} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href={href}>{label}</Link>)}</nav></details>}
