"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>{description && <p className="mt-1 text-muted">{description}</p>}</div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, Icon, tone = "accent", index = 0 }: { label: string; value: React.ReactNode; Icon: React.ComponentType<{ className?: string }>; tone?: "accent" | "info" | "success" | "warning"; index?: number }) {
  const tones = { accent: "bg-accent-soft text-accent-text", info: "bg-info-soft text-info", success: "bg-success-soft text-success", warning: "bg-warning-soft text-warning" };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }} className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between"><p className="text-sm text-muted">{label}</p><span className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}><Icon className="size-5" /></span></div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
    </motion.div>
  );
}

/** Horizontally scrollable table wrapper for small screens. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-2xl border border-border bg-card"><table className="w-full min-w-[640px] text-left text-sm">{children}</table></div>;
}
export const Th = ({ children, className }: { children?: React.ReactNode; className?: string }) => <th scope="col" className={cn("whitespace-nowrap border-b border-border bg-surface/60 px-4 py-3 font-semibold text-muted", className)}>{children}</th>;
export const Td = ({ children, className }: { children?: React.ReactNode; className?: string }) => <td className={cn("border-b border-border/70 px-4 py-3 align-middle", className)}>{children}</td>;
