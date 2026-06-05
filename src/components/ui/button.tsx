import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" &&
      "bg-slate-950 text-white shadow-sm shadow-slate-950/15 hover:bg-slate-800 focus:ring-sky-200",
    variant === "secondary" &&
      "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200",
    variant === "ghost" && "text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
