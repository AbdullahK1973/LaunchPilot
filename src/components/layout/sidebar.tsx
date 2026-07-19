"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, History, LayoutDashboard, Package, Rocket, Settings, UserRound, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/summary", label: "Dashboard", icon: LayoutDashboard },
  { href: "/actions", label: "Launches", icon: Rocket },
  { href: "/catalog", label: "Catalog", icon: Package },
  { href: "/team", label: "Team", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/history", label: "History", icon: History },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/account", label: "Account", icon: UserRound },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white">
          <BarChart3 size={20} />
        </span>
        <span>
          <span className="block text-base font-bold text-slate-950">LaunchPilot</span>
          <span className="text-xs font-medium text-slate-500">Launch workspace</span>
        </span>
      </Link>
      <nav className="mt-10 space-y-1">
        {navItems.map((item) => {
          const active = item.href !== "/" && pathname.startsWith(item.href.split("?")[0]);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                active && "bg-slate-950 text-white hover:bg-slate-900 hover:text-white",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
