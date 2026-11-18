import { Check } from "lucide-react";
import { Badge } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/payments/upgrade-button";

const plans = [
  { audience: "tutor" as const, name: "Tutor Pro", price: 15, highlight: true, features: ["Unlimited tuition listings", "Pro badge on your profile and listings"], free: ["Up to 2 tuition listings", "Applicant management", "Profile page"] },
  { audience: "student" as const, name: "Student Pro", price: 10, highlight: false, features: ["Priority booking: your applications appear first to tutors", "Pro badge on your applications"], free: ["Browse and search all tuitions", "Apply to tuitions", "Saved tuitions"] },
];

export function PricingCards() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
      {plans.map((p) => (
        <div key={p.name} className={cn("relative flex flex-col rounded-3xl border p-8", p.highlight ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
          {p.highlight && <Badge tone="accent" className="absolute right-6 top-6">Most popular</Badge>}
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="mt-4 text-5xl font-bold tracking-tight">${p.price}<span className={cn("text-base font-normal", p.highlight ? "opacity-70" : "text-muted")}> /month</span></p>
          <ul className="mt-7 flex-1 space-y-3 text-sm">
            {p.features.map((f) => (<li key={f} className="flex items-start gap-3"><Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{f}</li>))}
          </ul>
          <p className={cn("mt-7 border-t pt-5 text-xs", p.highlight ? "border-white/20 opacity-70 dark:border-black/20" : "border-border text-muted")}>Free plan: {p.free.join(" · ")}</p>
          <UpgradeButton audience={p.audience} highlight={p.highlight} />
        </div>
      ))}
    </div>
  );
}
