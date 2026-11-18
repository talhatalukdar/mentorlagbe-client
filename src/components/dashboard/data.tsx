"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PageMeta } from "@/types/api";

/** Authenticated, paginated list hook used by dashboard tables. */
export function useList<T>(key: string, path: string, page: number, extra: Record<string, string | number | undefined> = {}, limit = 10) {
  return useQuery({
    queryKey: [key, page, extra],
    queryFn: async () => { const r = await api<T[]>(path, { query: { page, limit, ...extra } }); return { items: r.data, meta: r.meta as PageMeta }; },
    placeholderData: (p) => p,
  });
}
