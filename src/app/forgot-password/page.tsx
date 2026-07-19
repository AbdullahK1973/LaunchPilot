import Link from "next/link";
import { RecoveryForm } from "@/components/auth/recovery-form";
import { Card } from "@/components/ui/card";
export default function ForgotPasswordPage(){return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><Card className="w-full max-w-md p-8"><h1 className="text-2xl font-semibold">Reset your password</h1><p className="my-4 text-sm text-slate-600">We’ll email a secure one-hour reset link.</p><RecoveryForm/><Link className="mt-5 block text-sm font-semibold text-sky-700" href="/login">Back to sign in</Link></Card></main>}
