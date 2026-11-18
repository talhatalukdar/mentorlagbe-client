"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListChecks, Pencil, Power, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatFee } from "@/lib/utils";
import type { Tuition } from "@/types/api";
import { PageHeader, TableWrap, Td, Th } from "@/components/dashboard/parts";
import { useList } from "@/components/dashboard/data";
import { Badge, EmptyState, ErrorState, Skeleton, statusTone } from "@/components/ui/misc";
import { Button, ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TuitionForm } from "@/components/dashboard/tuition-form";

export default function MyTuitions() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const list = useList<Tuition>("my-tuitions", "/tutor/tuitions", page);
  const [editing, setEditing] = useState<Tuition | null>(null);
  const [deleting, setDeleting] = useState<Tuition | null>(null);
  const refresh = () => { void qc.invalidateQueries({ queryKey: ["my-tuitions"] }); void qc.invalidateQueries({ queryKey: ["tutor-stats"] }); };

  const toggle = useMutation({ mutationFn: (t: Tuition) => api(`/tutor/tuitions/${t._id}/active`, { method: "PATCH", body: { isActive: !t.isActive } }), onSuccess: (_r, t) => { toast.success(t.isActive ? "Tuition closed" : "Tuition reopened"); refresh(); }, onError: (e) => toast.error(e.message) });
  const update = useMutation({ mutationFn: (v: { id: string; body: unknown }) => api(`/tutor/tuitions/${v.id}`, { method: "PATCH", body: v.body }), onSuccess: () => { toast.success("Tuition updated and sent for re-approval"); setEditing(null); refresh(); }, onError: (e) => toast.error(e.message) });
  const remove = useMutation({ mutationFn: (id: string) => api(`/tutor/tuitions/${id}`, { method: "DELETE" }), onSuccess: () => { toast.success("Tuition deleted"); setDeleting(null); refresh(); }, onError: (e) => toast.error(e.message) });

  return (
    <>
      <PageHeader title="My tuitions" description="Edit, close or delete your listings. Edited listings go back for admin approval." action={<ButtonLink href="/dashboard/tutor/post-tuition">Post a tuition</ButtonLink>} />
      {list.isPending ? <Skeleton className="h-64" /> : list.isError ? <ErrorState message={list.error.message} onRetry={() => void list.refetch()} /> : list.data.items.length === 0 ? (
        <EmptyState icon={<ListChecks className="size-6" />} title="No tuitions posted" description="Post your first batch — it will appear publicly once an admin approves it." action={<ButtonLink href="/dashboard/tutor/post-tuition">Post a tuition</ButtonLink>} />
      ) : (<>
        <TableWrap>
          <thead><tr><Th>Title</Th><Th>Fee</Th><Th>Approval</Th><Th>Status</Th><Th>Posted</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody>
            {list.data.items.map((t) => (
              <tr key={t._id} className="hover:bg-surface/50">
                <Td className="max-w-xs"><p className="truncate font-medium">{t.approvalStatus === "approved" ? <Link href={`/tuitions/${t._id}`} className="hover:text-accent-text">{t.title}</Link> : t.title}</p><p className="text-xs text-muted">{t.subject} · {t.classLevel} · {t.mode}</p></Td>
                <Td>{formatFee(t.monthlyFee)}</Td>
                <Td><Badge tone={statusTone(t.approvalStatus)} className="capitalize">{t.approvalStatus}</Badge></Td>
                <Td><Badge tone={t.isActive ? "success" : "neutral"}>{t.isActive ? "Active" : "Closed"}</Badge></Td>
                <Td>{formatDate(t.createdAt)}</Td>
                <Td className="text-right"><div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" aria-label={t.isActive ? "Close tuition" : "Reopen tuition"} title={t.isActive ? "Close" : "Reopen"} onClick={() => toggle.mutate(t)} disabled={toggle.isPending}><Power className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Edit tuition" title="Edit" onClick={() => setEditing(t)}><Pencil className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete tuition" title="Delete" className="text-danger" onClick={() => setDeleting(t)}><Trash2 className="size-4" /></Button>
                </div></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <div className="mt-6"><Pagination meta={list.data.meta} onChange={setPage} /></div>
      </>)}

      <Dialog.Root open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-2xl -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4"><div><Dialog.Title className="text-xl font-semibold">Edit tuition</Dialog.Title><Dialog.Description className="text-sm text-muted">Saving sends the listing back for admin approval.</Dialog.Description></div><Dialog.Close className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-surface" aria-label="Close"><X className="size-5" /></Dialog.Close></div>
            {editing && <TuitionForm initial={editing} submitLabel="Save changes" loading={update.isPending} onSubmit={(v) => update.mutate({ id: editing._id, body: v })} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this tuition?" description={`“${deleting?.title}” and all of its applications will be permanently removed.`} confirmLabel="Delete tuition" loading={remove.isPending} onConfirm={() => deleting && remove.mutate(deleting._id)} />
    </>
  );
}
