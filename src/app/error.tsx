"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><div className="max-w-lg text-center"><p className="text-sm font-bold uppercase text-rose-700">Something went wrong</p><h1 className="mt-3 text-3xl font-semibold">LaunchPilot could not complete that request.</h1><p className="mt-3 text-slate-600">{process.env.NODE_ENV==="development"?error.message:"Try again. If the problem continues, contact support with the error reference."}</p><Button className="mt-6" onClick={reset}>Try again</Button></div></main>;
}
