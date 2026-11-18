import type { ApiResponse } from "@/types/api";

export class ApiClientError extends Error {
  constructor(public status: number, message: string, public errors?: { path: string; message: string }[]) {
    super(message);
  }
}

let cached: { token: string; exp: number } | null = null;

/** Browser only: fetches (and caches for ~10 minutes) the BetterAuth JWT used for Express authorization. */
async function getToken(): Promise<string | null> {
  const { authClient } = await import("./auth-client");
  if (cached && cached.exp > Date.now()) return cached.token;
  const res = await authClient.token();
  const token = res.data?.token ?? null;
  cached = token ? { token, exp: Date.now() + 10 * 60_000 } : null;
  return token;
}
export const clearTokenCache = () => { cached = null; };

interface Options { method?: string; body?: unknown; auth?: boolean; query?: Record<string, string | number | undefined | null> }

export async function api<T>(path: string, { method = "GET", body, auth = true, query }: Options = {}): Promise<ApiResponse<T>> {
  const qs = query ? "?" + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => [k, String(v)])).toString() : "";
  const headers: Record<string, string> = {};
  if (body !== undefined && !(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiClientError(401, "Please sign in to continue");
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`/api${path}${qs === "?" ? "" : qs}`, {
    method,
    headers,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as (ApiResponse<T> & { errors?: { path: string; message: string }[] }) | null;
  if (!res.ok || !json?.success) {
    if (res.status === 401) clearTokenCache();
    throw new ApiClientError(res.status, json?.message ?? "Something went wrong. Please try again.", json?.errors);
  }
  return json;
}

/** Server-side (RSC) fetch of PUBLIC endpoints straight from the Express API. */
export async function serverApi<T>(path: string, revalidate = 60): Promise<ApiResponse<T> | null> {
  const base = process.env.API_URL ?? "http://localhost:5000";
  try {
    const res = await fetch(`${base}/api${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as ApiResponse<T>;
  } catch {
    return null;
  }
}
