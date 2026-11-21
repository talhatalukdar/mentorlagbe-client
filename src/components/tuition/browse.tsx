"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import { CLASS_LEVELS, SUBJECTS } from "@/lib/site";
import type { Tuition } from "@/types/api";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/misc";
import { Pagination } from "@/components/ui/pagination";
import { TuitionCard, TuitionCardSkeleton } from "./tuition-card";

const KEYS = ["search", "subject", "classLevel", "mode", "location", "maxFee", "sort", "page"] as const;

/** All state lives in the URL; every change triggers a fresh SERVER-side query (search, filters, sort, pagination). */
export function Browse() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const params = Object.fromEntries(KEYS.map((k) => [k, sp.get(k) ?? ""])) as Record<(typeof KEYS)[number], string>;
  const [typed, setTyped] = useState<string | null>(null);
  const search = typed ?? params.search;
  const [showFilters, setShowFilters] = useState(false);

  const update = (patch: Partial<Record<(typeof KEYS)[number], string>>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in patch)) next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  // Debounce typing → URL
  useEffect(() => {
    if (typed === null || typed === params.search) return;
    const id = setTimeout(() => { update({ search: typed }); setTyped(null); }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed]);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["tuitions", params],
    queryFn: () => api<Tuition[]>("/tuitions", { auth: false, query: { ...params, limit: 9, page: params.page || 1, sort: params.sort || "newest" } }),
    placeholderData: (prev) => prev,
  });

  const activeFilters = KEYS.filter((k) => !["page", "sort"].includes(k) && params[k]).length;
  const clear = () => router.replace(pathname);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Browse tuitions</h1>
        <p className="mt-2 text-muted">Approved, active listings from tutors across Bangladesh.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input aria-label="Search by title or subject" placeholder="Search by title or subject" value={search} onChange={(e) => setTyped(e.target.value)} className="pl-11" />
          </div>
          <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}><SlidersHorizontal className="size-4" />Filters{activeFilters ? ` (${activeFilters})` : ""}</Button>
        </div>
        <div className={`mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 ${showFilters ? "grid" : "hidden lg:grid"}`}>
          <Select aria-label="Subject" value={params.subject} onChange={(e) => update({ subject: e.target.value })}><option value="">All subjects</option>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</Select>
          <Select aria-label="Class level" value={params.classLevel} onChange={(e) => update({ classLevel: e.target.value })}><option value="">All class levels</option>{CLASS_LEVELS.map((s) => <option key={s}>{s}</option>)}</Select>
          <Select aria-label="Mode" value={params.mode} onChange={(e) => update({ mode: e.target.value })}><option value="">Online & offline</option><option>Online</option><option>Offline</option></Select>
          <Select aria-label="Maximum monthly fee" value={params.maxFee} onChange={(e) => update({ maxFee: e.target.value })}><option value="">Any budget</option>{[3000, 4000, 5000, 6000].map((n) => <option key={n} value={n}>Up to ৳{n.toLocaleString()}</option>)}</Select>
          <Select aria-label="Sort" value={params.sort} onChange={(e) => update({ sort: e.target.value })}><option value="">Newest first</option><option value="fee_asc">Fee: low to high</option><option value="fee_desc">Fee: high to low</option><option value="rating">Top rated</option></Select>
        </div>
        {activeFilters > 0 && <button onClick={clear} className="mt-3 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-accent-text hover:underline"><X className="size-4" />Clear all filters</button>}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-muted" aria-live="polite">
        <span>{data ? `${data.meta?.total ?? 0} tuition${data.meta?.total === 1 ? "" : "s"} found` : "Loading…"}</span>
        {isFetching && !isPending && <span>Updating…</span>}
      </div>

      <div className="mt-4">
        {isPending ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <TuitionCardSkeleton key={i} />)}</div>
        ) : isError ? (
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        ) : data.data.length === 0 ? (
          <EmptyState icon={<Search className="size-6" />} title="No tuitions match your filters" description="Try a different subject or remove a filter to see more results." action={<Button variant="outline" onClick={clear}>Clear filters</Button>} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.data.map((t) => <TuitionCard key={t._id} t={t} />)}</div>
        )}
      </div>
      {data?.meta && <div className="mt-10"><Pagination meta={data.meta} onChange={(p) => { update({ page: String(p) }); window.scrollTo({ top: 0, behavior: "smooth" }); }} /></div>}
    </div>
  );
}
