import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 text-xl font-bold tracking-tight ${className}`} aria-label="MentorLagbe home">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><GraduationCap className="size-5" aria-hidden /></span>
      MentorLagbe
    </Link>
  );
}
