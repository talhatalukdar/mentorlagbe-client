"use client";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CircleDollarSign, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/dashboard/parts";
import { ErrorState, Skeleton } from "@/components/ui/misc";

interface Stats { users: { total: number; students: number; tutors: number; admins: number }; tuitions: { pending: number; approved: number; rejected: number }; revenue: { currency: string; total: number }[]; paidTransactions: number }

export default function AdminOverview() {
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: async () => (await api<Stats>("/admin/stats")).data });
  if (q.isError) return <ErrorState message={q.error.message} onRetry={() => void q.refetch()} />;
  const d = q.data;
  const revenue = d?.revenue.length ? d.revenue.map((r) => `${r.currency === "USD" ? "$" : r.currency + " "}${r.total.toLocaleString()}`).join(" + ") : "$0";
  const chart = d ? [{ name: "Pending", value: d.tuitions.pending, fill: "var(--warning)" }, { name: "Approved", value: d.tuitions.approved, fill: "var(--success)" }, { name: "Rejected", value: d.tuitions.rejected, fill: "var(--danger)" }] : [];
  return (
    <>
      <PageHeader title="Platform overview" description="Live numbers from the database." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!d ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />) : (<>
          <StatCard index={0} label="Total users" value={d.users.total} Icon={Users} tone="info" />
          <StatCard index={1} label="Total tutors" value={d.users.tutors} Icon={GraduationCap} tone="accent" />
          <StatCard index={2} label="Pending / approved tuitions" value={`${d.tuitions.pending} / ${d.tuitions.approved}`} Icon={ShieldCheck} tone="warning" />
          <StatCard index={3} label="Stripe revenue" value={revenue} Icon={CircleDollarSign} tone="success" />
        </>)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6" aria-label="Tuitions by approval status">
          <h2 className="font-semibold">Tuitions by approval status</h2>
          <div className="mt-4 h-64">
            {!d ? <Skeleton className="size-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="name" stroke="var(--muted)" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} stroke="var(--muted)" tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--surface)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--ink)" }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>{chart.map((c) => <Cell key={c.name} fill={c.fill} />)}</Bar></BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Users by role</h2>
          {!d ? <Skeleton className="mt-4 h-40" /> : (
            <ul className="mt-4 space-y-4">
              {([["Students", d.users.students], ["Tutors", d.users.tutors], ["Admins", d.users.admins]] as const).map(([label, n]) => (
                <li key={label}><div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{n}</span></div><div className="h-2 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-accent" style={{ width: `${d.users.total ? (n / d.users.total) * 100 : 0}%` }} /></div></li>
              ))}
              <li className="border-t border-border pt-4 text-sm text-muted">{d.paidTransactions} paid subscription transaction{d.paidTransactions === 1 ? "" : "s"} recorded.</li>
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
