"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/parts";
import { TuitionForm } from "@/components/dashboard/tuition-form";
import { useMe } from "@/components/dashboard/use-me";

export default function PostTuition() {
  const router = useRouter();
  const qc = useQueryClient();
  const me = useMe();
  const create = useMutation({
    mutationFn: (body: unknown) => api("/tutor/tuitions", { method: "POST", body }),
    onSuccess: () => { toast.success("Tuition submitted for admin approval"); void qc.invalidateQueries({ queryKey: ["my-tuitions"] }); void qc.invalidateQueries({ queryKey: ["tutor-stats"] }); router.push("/dashboard/tutor/my-tuitions"); },
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <PageHeader title="Post a tuition" description="New listings are reviewed by an admin before they appear publicly." />
      {me.data?.plan === "free" && <p className="mb-6 rounded-xl border border-border bg-surface/70 px-4 py-3 text-sm text-muted">Free plan: up to 2 tuition posts. <Link href="/pricing" className="font-semibold text-accent-text hover:underline">Upgrade to Pro</Link> for unlimited posts.</p>}
      <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8"><TuitionForm submitLabel="Submit for approval" loading={create.isPending} onSubmit={(v) => create.mutate(v)} /></div>
    </>
  );
}
