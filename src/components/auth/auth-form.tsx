"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(mode === "login" ? signIn : signUp, {});
  return <form action={formAction} className="space-y-4">
    {mode === "signup" ? <Field label="Name"><Input name="name" autoComplete="name" required minLength={2}/></Field> : null}
    <Field label="Email"><Input name="email" type="email" autoComplete="email" required/></Field>
    <Field label="Password"><Input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8}/></Field>
    {state.error ? <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{state.error}</p> : null}
    <Button className="w-full" disabled={pending}>{pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</Button>
    <p className="text-center text-sm text-slate-600">{mode === "login" ? "New to LaunchPilot? " : "Already have an account? "}<Link className="font-semibold text-sky-700" href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Create one" : "Sign in"}</Link></p>
  </form>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>;
}
