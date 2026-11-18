"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, CheckCircle2, Crown, FileText, Hourglass } from "lucide-react";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { PageHeader, StatCard } from "@/components/dashboard/parts";
import { ButtonLink } from "@/components/ui/button";
import { ErrorState, Skeleton } from "@/components/ui/misc";
import { useMe } from "@/components/dashboard/use-me";

export default function StudentOverview() {
  const { data: session } = authClient.useSession();
  const me = useMe();
  const stats = useQuery({ queryKey: ["student-stats"], queryFn: async () => (await api<{ totalApplied: number; accepted: number; pending: number; rejected: number; saved: number }>("/student/stats")).data });
  return (
    <>
      <PageHeader title={`Welcome, ${session?.user?.name?.split(" ")[0] ?? "student"}`} description="Here is a snapshot of your tuition search." action={<ButtonLink href="/tuitions">Browse tuitions</ButtonLink>} />
      {stats.isError ? <ErrorState message={stats.error.message} onRetry={() => void stats.refetch()} /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.isPending ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />) : (<>
            <StatCard index={0} label="Total applied" value={stats.data.totalApplied} Icon={FileText} tone="info" />
            <StatCard index={1} label="Accepted" value={stats.data.accepted} Icon={CheckCircle2} tone="success" />
            <StatCard index={2} label="Pending" value={stats.data.pending} Icon={Hourglass} tone="warning" />
            <StatCard index={3} label="Current plan" value={<span className="capitalize">{me.data?.plan ?? "…"}</span>} Icon={Crown} tone="accent" />
          </>)}
        </div>
      )}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/student/saved-tuitions" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-ink/30"><Bookmark className="size-8 text-accent-text" /><div><p className="font-semibold">Saved tuitions</p><p className="text-sm text-muted">{stats.data ? `${stats.data.saved} saved` : "Your bookmarked listings"}</p></div></Link>
        {me.data?.plan === "free" && <Link href="/pricing" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-ink/30"><Crown className="size-8 text-accent-text" /><div><p className="font-semibold">Upgrade to Student Pro</p><p className="text-sm text-muted">Priority booking for $10/month</p></div></Link>}
      </div>
    </>
  );
}
