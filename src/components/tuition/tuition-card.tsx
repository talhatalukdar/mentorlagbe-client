import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Star, Wifi, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { formatFee } from "@/lib/utils";
import type { Tuition } from "@/types/api";
import { SubjectVisual } from "./subject-visual";
import { SaveButton } from "./save-button";

export function TuitionCard({ t }: { t: Tuition }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-xl hover:shadow-ink/5">
      <div className="relative aspect-[16/9] overflow-hidden">
        {t.bannerImage ? (
          <Image src={t.bannerImage} alt={`${t.title} banner`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <SubjectVisual subject={t.subject} className="size-full transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute left-3 top-3"><Badge tone={t.mode === "Online" ? "info" : "success"} className="bg-card/90 backdrop-blur">{t.mode === "Online" ? <Wifi className="size-3" /> : <Building2 className="size-3" />}{t.mode}</Badge></div>
        <div className="absolute right-3 top-3"><SaveButton tuitionId={t._id} /></div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{t.subject}</Badge>
          <Badge>{t.classLevel}</Badge>
          {!!t.ratingCount && <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold"><Star className="size-3.5 fill-star text-star" />{t.ratingAvg?.toFixed(1)} <span className="font-normal text-muted">({t.ratingCount})</span></span>}
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug"><Link href={`/tuitions/${t._id}`} className="after:absolute after:inset-0 hover:text-accent-text" style={{ position: "static" }}>{t.title}</Link></h3>
        <ul className="mt-3 space-y-1.5 text-sm text-muted">
          <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0" aria-hidden /><span className="truncate">{t.location}</span></li>
          <li className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0" aria-hidden />{t.daysPerWeek} days / week</li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xl font-bold">{formatFee(t.monthlyFee)}<span className="text-sm font-normal text-muted"> /month</span></p>
            <p className="mt-0.5 truncate text-xs text-muted">by {t.tutorName}</p>
          </div>
          <ButtonLink href={`/tuitions/${t._id}`} size="sm" variant="outline">View Details</ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function TuitionCardSkeleton() {
  return <div className="h-[26rem] animate-pulse rounded-2xl border border-border bg-card"><div className="aspect-[16/9] rounded-t-2xl bg-border/70" /><div className="space-y-3 p-5"><div className="h-5 w-1/2 rounded bg-border/70" /><div className="h-6 w-4/5 rounded bg-border/70" /><div className="h-4 w-2/3 rounded bg-border/70" /></div></div>;
}
