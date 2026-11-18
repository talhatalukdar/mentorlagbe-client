"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ClipboardList, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/types/api";
import { PageHeader, TableWrap, Td, Th } from "@/components/dashboard/parts";
import { useList } from "@/components/dashboard/data";
import { Badge, EmptyState, ErrorState, Skeleton, statusTone } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export default function Applicants() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const list = useList<Application>("applicants", "/tutor/applicants", page);
  const decide = useMutation({
    mutationFn: (v: { id: string; status: "accepted" | "rejected" }) => api(`/tutor/applications/${v.id}`, { method: "PATCH", body: { status: v.status } }),
    onSuccess: (_r, v) => { toast.success(`Application ${v.status}`); void qc.invalidateQueries({ queryKey: ["applicants"] }); void qc.invalidateQueries({ queryKey: ["tutor-stats"] }); },
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <PageHeader title="Applicants" description="Students who applied to your tuitions." />
      {list.isPending ? <Skeleton className="h-64" /> : list.isError ? <ErrorState message={list.error.message} onRetry={() => void list.refetch()} /> : list.data.items.length === 0 ? (
        <EmptyState icon={<ClipboardList className="size-6" />} title="No applicants yet" description="When students apply to your approved tuitions, they will show up here." />
      ) : (<>
        <TableWrap>
          <thead><tr><Th>Student</Th><Th>Phone</Th><Th>Tuition</Th><Th>Schedule & note</Th><Th>Applied</Th><Th>Status</Th><Th className="text-right">Decision</Th></tr></thead>
          <tbody>
            {list.data.items.map((a) => (
              <tr key={a._id} className="hover:bg-surface/50">
                <Td><p className="font-medium">{a.studentName}</p><p className="text-xs text-muted">{a.studentEmail}</p></Td>
                <Td>{a.studentPhone}</Td>
                <Td className="max-w-[12rem]"><p className="truncate">{a.tuitionTitle}</p></Td>
                <Td className="max-w-xs"><p className="text-xs text-muted">{a.preferredSchedule}</p><p className="line-clamp-2">{a.studentNote}</p></Td>
                <Td>{formatDate(a.appliedAt)}</Td>
                <Td><Badge tone={statusTone(a.status)} className="capitalize">{a.status}</Badge></Td>
                <Td className="text-right"><div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" disabled={a.status === "accepted" || decide.isPending} onClick={() => decide.mutate({ id: a._id, status: "accepted" })}><Check className="size-4" />Accept</Button>
                  <Button size="sm" variant="danger" disabled={a.status === "rejected" || decide.isPending} onClick={() => decide.mutate({ id: a._id, status: "rejected" })}><X className="size-4" />Reject</Button>
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
