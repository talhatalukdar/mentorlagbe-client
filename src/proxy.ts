import { NextResponse, type NextRequest } from "next/server";

// Fast, optimistic gate: dashboards need a BetterAuth session cookie. The REAL role check happens
// on the server in app/dashboard/layout.tsx and again in Express for every API call.
const COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];

export function proxy(req: NextRequest) {
  if (!COOKIES.some((c) => req.cookies.has(c))) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
