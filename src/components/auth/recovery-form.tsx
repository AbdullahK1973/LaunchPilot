"use client";
import { useActionState } from "react";
import { requestPasswordReset, resetPassword, type AccountState } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RecoveryForm({ token }: { token?: string }) {
  const action = token ? resetPassword : requestPasswordReset;
  const [state, submit, pending] = useActionState<AccountState, FormData>(action, {});
  return <form action={submit} className="space-y-4">
    {token ? <><input type="hidden" name="token" value={token}/><Input name="password" type="password" minLength={8} placeholder="New password" required/></> :
      <Input name="email" type="email" placeholder="you@example.com" required/>}
    {state.error?<p role="alert" className="text-sm text-rose-700">{state.error}</p>:null}
    {state.success?<p role="status" className="text-sm text-emerald-700">{state.success}</p>:null}
    <Button className="w-full" disabled={pending}>{pending?"Please wait…":token?"Reset password":"Send reset link"}</Button>
  </form>;
}
