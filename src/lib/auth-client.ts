"use client";
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// baseURL is the current origin; /api/auth/* is proxied to Express (see next.config.ts).
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL,
  plugins: [jwtClient()],
});
