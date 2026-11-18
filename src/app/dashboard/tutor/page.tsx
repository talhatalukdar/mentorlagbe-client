"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, Crown, ListChecks, Hourglass } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/dashboard/parts";
import { ButtonLink } from "@/components/ui/button";
import { ErrorState, Skeleton } from "@/components/ui/misc";
import { useMe } from "@/components/dashboard/use-me";

interface Stats { totalTuitions: number; approved: number; pending: number; rejected: number; totalApplicants: number; pendingApplicants: number }

export default function TutorOverview() {
  const me = useMe();
  const stats = useQuery({ queryKey: ["tutor-stats"], queryFn: async () => (await api<Stats>("/tutor/stats")).data });
  return (
    <>
      <PageHeader title="Tutor overview" description="Your listings and applicants at a glance." action={<ButtonLink href="/dashboard/tutor/post-tuition">Post a tuition</ButtonLink>} />
      {stats.isError ? <ErrorState message={stats.error.message} onRetry={() => void stats.refetch()} /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.isPending ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />) : (<>
            <StatCard index={0} label="Tuitions posted" value={stats.data.totalTuitions} Icon={ListChecks} tone="info" />
            <StatCard index={1} label="Approved & live" value={stats.data.approved} Icon={CheckCircle2} tone="success" />
            <StatCard index={2} label="Applicants received" value={stats.data.totalApplicants} Icon={ClipboardList} tone="accent" />
            <StatCard index={3} label="Current plan" value={<span className="capitalize">{me.data?.plan ?? "…"}</span>} Icon={Crown} tone="warning" />
          </>)}
        </div>
      )}
      {stats.data && (stats.data.pending > 0 || stats.data.pendingApplicants > 0) && (
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {stats.data.pending > 0 && <p className="flex items-center gap-2 rounded-xl bg-warning-soft px-4 py-3 text-warning"><Hourglass className="size-4" />{stats.data.pending} listing{stats.data.pending > 1 ? "s" : ""} awaiting admin approval</p>}
          {stats.data.pendingApplicants > 0 && <Link href="/dashboard/tutor/applicants" className="rounded-xl bg-info-soft px-4 py-3 font-medium text-info hover:brightness-95">{stats.data.pendingApplicants} applicant{stats.data.pendingApplicants > 1 ? "s" : ""} waiting for your decision</Link>}
        </div>
      )}
      {me.data?.plan === "free" && <p className="mt-6 text-sm text-muted">Free plan allows 2 listings. <Link href="/pricing" className="font-semibold text-accent-text hover:underline">Upgrade to Tutor Pro</Link> for unlimited posts.</p>}
    </>
  );
}
