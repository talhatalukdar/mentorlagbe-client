"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatFee } from "@/lib/utils";
import type { Application } from "@/types/api";
import { PageHeader, TableWrap, Td, Th } from "@/components/dashboard/parts";
import { useList } from "@/components/dashboard/data";
import { Badge, EmptyState, ErrorState, Skeleton, statusTone } from "@/components/ui/misc";
import { Button, ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function MyApplications() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const list = useList<Application>("my-applications", "/student/applications", page);
  const [target, setTarget] = useState<Application | null>(null);
  const cancel = useMutation({
    mutationFn: (id: string) => api(`/student/applications/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Application cancelled"); setTarget(null); void qc.invalidateQueries({ queryKey: ["my-applications"] }); void qc.invalidateQueries({ queryKey: ["student-stats"] }); },
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <PageHeader title="My applications" description="Track every tuition you applied to." />
      {list.isPending ? <Skeleton className="h-64" /> : list.isError ? <ErrorState message={list.error.message} onRetry={() => void list.refetch()} /> : list.data.items.length === 0 ? (
        <EmptyState icon={<FileText className="size-6" />} title="No applications yet" description="Find a tuition that fits and send your first application." action={<ButtonLink href="/tuitions">Browse tuitions</ButtonLink>} />
      ) : (
        <>
          <TableWrap>
            <thead><tr><Th>Tuition</Th><Th>Tutor</Th><Th>Monthly fee</Th><Th>Applied</Th><Th>Status</Th><Th className="text-right">Action</Th></tr></thead>
            <tbody>
              {list.data.items.map((a) => (
                <tr key={a._id} className="transition-colors hover:bg-surface/50">
                  <Td><Link href={`/tuitions/${a.tuitionId}`} className="font-medium hover:text-accent-text">{a.tuitionTitle}</Link><p className="text-xs text-muted">{a.subject}</p></Td>
                  <Td>{a.tutorEmail}</Td>
                  <Td>{formatFee(a.monthlyFee)}</Td>
                  <Td>{formatDate(a.appliedAt)}</Td>
                  <Td><Badge tone={statusTone(a.status)} className="capitalize">{a.status}</Badge></Td>
                  <Td className="text-right">{a.status === "pending" ? <Button size="sm" variant="danger" onClick={() => setTarget(a)}><Trash2 className="size-4" />Cancel</Button> : <span className="text-xs text-muted">—</span>}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <div className="mt-6"><Pagination meta={list.data.meta} onChange={setPage} /></div>
        </>
      )}
      <ConfirmDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)} title="Cancel this application?" description={`Your application to “${target?.tuitionTitle}” will be removed. You can apply again later.`} confirmLabel="Cancel application" loading={cancel.isPending} onConfirm={() => target && cancel.mutate(target._id)} />
    </>
  );
}
