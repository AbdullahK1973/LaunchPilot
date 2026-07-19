import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
export default function NotFound(){return <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><p className="text-sm font-bold uppercase text-sky-700">404</p><h1 className="mt-3 text-4xl font-semibold">That page is not on the launch plan.</h1><Link className={buttonClasses("primary","mt-6")} href="/">Return home</Link></div></main>}
