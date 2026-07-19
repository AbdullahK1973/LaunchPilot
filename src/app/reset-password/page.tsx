import { RecoveryForm } from "@/components/auth/recovery-form";
import { Card } from "@/components/ui/card";
export default async function ResetPasswordPage({searchParams}:{searchParams:Promise<{token?:string}>}){const {token}=await searchParams;return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><Card className="w-full max-w-md p-8"><h1 className="mb-5 text-2xl font-semibold">Choose a new password</h1>{token?<RecoveryForm token={token}/>:<p className="text-rose-700">The reset token is missing.</p>}</Card></main>}
