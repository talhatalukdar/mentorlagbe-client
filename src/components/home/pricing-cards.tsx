"use client";
import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { UpgradeButton } from "@/components/payments/upgrade-button";

const plans = {
  student: {
    label: "For students", price: 10, name: "Student Pro",
    free: ["Browse and search every approved tuition", "Apply to tuitions", "Save tuitions and track applications", "Review a tutor after you are accepted"],
    pro: ["Everything in Free", "Priority booking: your applications appear first to tutors", "Pro badge on your applications"],
  },
  tutor: {
    label: "For tutors", price: 15, name: "Tutor Pro",
    free: ["Up to 2 tuition listings", "Applicant management", "Profile page with ImgBB photo upload"],
    pro: ["Everything in Free", "Unlimited tuition listings", "Pro badge on your profile and listings"],
  },
} as const;

function Feature({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <li className="flex items-start gap-3 text-sm"><span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", tone)}><Check className="size-3" aria-hidden /></span><span>{children}</span></li>;
}

export function PricingCards() {
  const [audience, setAudience] = useState<"student" | "tutor">("student");
  const p = plans[audience];
  return (
    <div>
      <div role="tablist" aria-label="Choose audience" className="mx-auto mb-10 flex w-fit rounded-full border border-border bg-card p-1">
        {(["student", "tutor"] as const).map((a) => (
          <button key={a} role="tab" aria-selected={audience === a} onClick={() => setAudience(a)} className={cn("cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-colors", audience === a ? "bg-primary text-primary-foreground" : "text-muted hover:text-ink")}>{plans[a].label}</button>
        ))}
      </div>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="flex flex-col rounded-3xl border border-border bg-card p-8">
          <h3 className="text-lg font-semibold">Free</h3>
          <p className="mt-3 font-display text-6xl font-bold leading-none">$0<span className="ml-1 font-sans text-base font-medium text-muted">forever</span></p>
          <p className="mt-3 text-sm text-muted">Everything you need to get started.</p>
          <ul className="mt-6 flex-1 space-y-3">{p.free.map((f) => <Feature key={f} tone="bg-surface text-muted">{f}</Feature>)}</ul>
          <ButtonLink href="/sign-up" variant="outline" size="lg" className="mt-8 w-full">Start free</ButtonLink>
        </div>
        <div className="relative flex flex-col rounded-3xl bg-gradient-to-br from-primary via-[#8a5cff] to-accent p-[2px] shadow-xl shadow-primary/20">
          <div className="flex flex-1 flex-col rounded-[22px] bg-card p-8">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{p.name}</h3><span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-text"><Crown className="size-3.5" aria-hidden />Recommended</span></div>
            <p className="mt-3 font-display text-6xl font-bold leading-none"><span className="text-gradient">${p.price}</span><span className="ml-1 font-sans text-base font-medium text-muted">/month</span></p>
            <p className="mt-3 text-sm text-muted">Billed monthly through Stripe. Cancel any time.</p>
            <ul className="mt-6 flex-1 space-y-3">{p.pro.map((f) => <Feature key={f} tone="bg-violet-soft text-primary">{f}</Feature>)}</ul>
            <UpgradeButton audience={audience} highlight />
          </div>
        </div>
      </div>
    </div>
  );
}
