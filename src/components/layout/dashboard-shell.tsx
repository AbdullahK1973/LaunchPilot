import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { signOut } from "@/app/actions/auth";
import { MobileNav } from "@/components/layout/mobile-nav";

type DashboardShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DashboardShell({ title, description, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3"><MobileNav/><h1 className="truncate text-2xl font-semibold tracking-tight text-slate-950">{title}</h1></div>
                {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
              </div>
              <Link
                href="/onboarding"
                className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 md:inline-flex"
              >
                <Sparkles size={16} />
                New Launch
              </Link>
              <form action={signOut}>
                <button className="text-sm font-semibold text-slate-500 hover:text-slate-950">Sign out</button>
              </form>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
