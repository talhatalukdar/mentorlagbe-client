import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageMeta } from "@/types/api";

function pages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1), end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let p = start; p <= end; p++) out.push(p);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

export function Pagination({ meta, onChange }: { meta: PageMeta; onChange: (page: number) => void }) {
  if (meta.totalPages <= 1) return null;
  const btn = "grid h-10 min-w-10 cursor-pointer place-items-center rounded-full border border-border bg-card px-3 font-mono text-sm transition-colors hover:border-ink/40 disabled:pointer-events-none disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button className={cn(btn, "gap-1")} disabled={!meta.hasPreviousPage} onClick={() => onChange(meta.page - 1)}><ChevronLeft className="size-4" />Previous</button>
      {pages(meta.page, meta.totalPages).map((p, i) =>
        p === "…" ? <span key={`e${i}`} className="px-1 text-muted">…</span> : (
          <button key={p} aria-current={p === meta.page ? "page" : undefined} onClick={() => onChange(p)} className={cn(btn, p === meta.page && "border-primary bg-primary text-primary-foreground hover:border-primary")}>{p}</button>
        ),
      )}
      <button className={cn(btn, "gap-1")} disabled={!meta.hasNextPage} onClick={() => onChange(meta.page + 1)}>Next<ChevronRight className="size-4" /></button>
    </nav>
  );
}
