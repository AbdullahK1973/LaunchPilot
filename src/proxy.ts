import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes=["/summary","/onboarding","/launches","/workspace","/history","/billing","/settings","/actions"];
export function proxy(request:NextRequest){
  if(protectedPrefixes.some(prefix=>request.nextUrl.pathname.startsWith(prefix))&&!request.cookies.has("launchpilot_session")){
    const login=new URL("/login",request.url);login.searchParams.set("next",request.nextUrl.pathname);return NextResponse.redirect(login);
  }
  return NextResponse.next();
}
export const config={matcher:["/summary/:path*","/onboarding/:path*","/launches/:path*","/workspace/:path*","/history/:path*","/billing/:path*","/settings/:path*","/actions/:path*"]};
