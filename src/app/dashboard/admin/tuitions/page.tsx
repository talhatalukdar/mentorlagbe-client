"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ShieldCheck, X } from "lucide-react";
import { api } from "@/lib/api";
import { cn, formatDate, formatFee } from "@/lib/utils";
import type { Tuition } from "@/types/api";
import { PageHeader, TableWrap, Td, Th } from "@/components/dashboard/parts";
import { useList } from "@/components/dashboard/data";
import { Badge, EmptyState, ErrorState, Skeleton, statusTone } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

const tabs = [["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["", "All"]] as const;

export default function AdminTuitions() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("pending");
  const qc = useQueryClient();
  const list = useList<Tuition>("admin-tuitions", "/admin/tuitions", page, { status });
  const decide = useMutation({
    mutationFn: (v: { id: string; approvalStatus: "approved" | "rejected" }) => api(`/admin/tuitions/${v.id}/status`, { method: "PATCH", body: { approvalStatus: v.approvalStatus } }),
    onSuccess: (_r, v) => { toast.success(`Tuition ${v.approvalStatus}`); void qc.invalidateQueries({ queryKey: ["admin-tuitions"] }); void qc.invalidateQueries({ queryKey: ["admin-stats"] }); },
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <PageHeader title="Tuition approvals" description="Only approved, active tuitions appear on Browse Tuitions." />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by approval status">
        {tabs.map(([v, label]) => <button key={label} role="tab" aria-selected={status === v} onClick={() => { setStatus(v); setPage(1); }} className={cn("cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors", status === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-ink/40")}>{label}</button>)}
      </div>
      {list.isPending ? <Skeleton className="h-64" /> : list.isError ? <ErrorState message={list.error.message} onRetry={() => void list.refetch()} /> : list.data.items.length === 0 ? <EmptyState icon={<ShieldCheck className="size-6" />} title="Nothing to review" description="No tuitions match this status right now." /> : (<>
        <TableWrap>
          <thead><tr><Th>Tuition</Th><Th>Tutor</Th><Th>Fee</Th><Th>Posted</Th><Th>Status</Th><Th className="text-right">Decision</Th></tr></thead>
          <tbody>
            {list.data.items.map((t) => (
              <tr key={t._id} className="hover:bg-surface/50">
                <Td className="max-w-xs"><p className="truncate font-medium">{t.approvalStatus === "approved" ? <Link href={`/tuitions/${t._id}`} className="hover:text-accent-text">{t.title}</Link> : t.title}</p><p className="text-xs text-muted">{t.subject} · {t.classLevel} · {t.mode} · {t.location}</p></Td>
                <Td><p>{t.tutorName}</p><p className="text-xs text-muted">{t.tutorEmail}</p></Td>
                <Td>{formatFee(t.monthlyFee)}</Td>
                <Td>{formatDate(t.createdAt)}</Td>
                <Td><Badge tone={statusTone(t.approvalStatus)} className="capitalize">{t.approvalStatus}</Badge></Td>
                <Td className="text-right"><div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" disabled={t.approvalStatus === "approved" || decide.isPending} onClick={() => decide.mutate({ id: t._id, approvalStatus: "approved" })}><Check className="size-4" />Approve</Button>
                  <Button size="sm" variant="danger" disabled={t.approvalStatus === "rejected" || decide.isPending} onClick={() => decide.mutate({ id: t._id, approvalStatus: "rejected" })}><X className="size-4" />Reject</Button>
                </div></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <div className="mt-6"><Pagination meta={list.data.meta} onChange={setPage} /></div>
      </>)}
    </>
  );
}
