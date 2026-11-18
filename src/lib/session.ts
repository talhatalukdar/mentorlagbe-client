import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@/types/api";

export interface ServerUser { id: string; name: string; email: string; image?: string | null; role: Role }

/** Resolves the BetterAuth session on the server by forwarding the browser's cookies to Express. */
export async function getServerUser(): Promise<ServerUser | null> {
  const base = process.env.API_URL ?? "http://localhost:5000";
  const cookie = (await cookies()).toString();
  if (!cookie) return null;
  try {
    const res = await fetch(`${base}/api/auth/get-session`, { headers: { cookie }, cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: ServerUser } | null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function requireRole(role: Role): Promise<ServerUser> {
  const user = await getServerUser();
  if (!user) redirect("/sign-in");
  if (user.role !== role) redirect(`/dashboard/${user.role}`);
  return user;
}
