import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => <div className={cn("animate-pulse rounded-xl bg-border/70", className)} aria-hidden />;

const tones = {
  neutral: "bg-surface text-muted",
  accent: "bg-accent-soft text-accent-text",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
} as const;

export function Badge({ tone = "neutral", className, children }: { tone?: keyof typeof tones; className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

export const statusTone = (s: string) => (s === "approved" || s === "accepted" || s === "paid" ? "success" : s === "rejected" ? "danger" : s === "pending" ? "warning" : "neutral");

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-surface text-accent-text">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-soft px-6 py-8 text-center">
      <p className="font-semibold text-danger">Couldn’t load this data</p>
      <p className="mt-1 text-sm text-danger/90">{message}</p>
      {onRetry && <button onClick={onRetry} className="mt-4 rounded-full bg-danger px-5 py-2 text-sm font-semibold text-white">Try again</button>}
    </div>
  );
}
