import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Clock, GraduationCap, MapPin, Wifi, Building2, ListChecks } from "lucide-react";
import { serverApi } from "@/lib/api";
import type { Tuition } from "@/types/api";
import { formatDate, formatFee } from "@/lib/utils";
import { Badge } from "@/components/ui/misc";
import { SubjectVisual } from "@/components/tuition/subject-visual";
import { ApplyPanel } from "@/components/tuition/apply-panel";
import { ReviewSection } from "@/components/tuition/review-section";
import { SaveButton } from "@/components/tuition/save-button";
import { Avatar } from "@/components/layout/user-menu";

type Props = { params: Promise<{ id: string }> };

const load = async (id: string) => (await serverApi<Tuition>(`/tuitions/${id}`, 30))?.data ?? null;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await load((await params).id);
  return { title: t?.title ?? "Tuition not found", description: t ? `${t.subject} for ${t.classLevel} — ${t.mode}, ${formatFee(t.monthlyFee)}/month` : undefined };
}

export default async function TuitionDetailsPage({ params }: Props) {
  const { id } = await params;
  const t = await load(id);
  if (!t) notFound();
  const facts = [
    { Icon: GraduationCap, label: "Class level", value: t.classLevel },
    { Icon: t.mode === "Online" ? Wifi : Building2, label: "Mode", value: t.mode },
    { Icon: MapPin, label: "Location", value: t.location },
    { Icon: CalendarDays, label: "Days per week", value: `${t.daysPerWeek} days` },
    ...(t.schedule ? [{ Icon: Clock, label: "Schedule", value: t.schedule }] : []),
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted"><Link href="/tuitions" className="hover:text-ink">Browse Tuitions</Link> / <span className="text-ink">{t.subject}</span></nav>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl">
            {t.bannerImage ? <Image src={t.bannerImage} alt={`${t.title} banner`} fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" /> : <SubjectVisual subject={t.subject} className="size-full" />}
            <div className="absolute right-4 top-4"><SaveButton tuitionId={t._id} className="size-11" /></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2"><Badge tone="accent">{t.subject}</Badge><Badge tone={t.mode === "Online" ? "info" : "success"}>{t.mode}</Badge><Badge>{t.classLevel}</Badge></div>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-2 text-sm text-muted">Posted {formatDate(t.createdAt)}</p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4 sm:col-span-2"><dt className="text-sm text-muted">Monthly fee</dt><dd className="text-3xl font-bold">{formatFee(t.monthlyFee)}</dd></div>
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"><Icon className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden /><div><dt className="text-sm text-muted">{label}</dt><dd className="font-medium">{value}</dd></div></div>
            ))}
          </dl>

          <h2 className="mt-10 text-2xl font-bold">About this tuition</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">{t.description}</p>
          {t.requirements && <><h2 className="mt-8 flex items-center gap-2 text-xl font-bold"><ListChecks className="size-5" aria-hidden />Requirements</h2><p className="mt-2 whitespace-pre-line text-muted">{t.requirements}</p></>}
          <ReviewSection tuitionId={t._id} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ApplyPanel tuitionId={t._id} />
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">About the tutor</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar user={{ name: t.tutor?.name ?? t.tutorName, image: t.tutor?.image ?? null }} size={52} />
              <div><p className="flex items-center gap-1.5 font-semibold">{t.tutor?.name ?? t.tutorName}{t.tutor?.isVerified && <BadgeCheck className="size-4 text-info" aria-label="Verified tutor" />}</p>{t.tutor?.education && <p className="text-sm text-muted">{t.tutor.education}</p>}</div>
            </div>
            {t.tutor?.experience && <p className="mt-4 text-sm"><strong>Experience:</strong> <span className="text-muted">{t.tutor.experience}</span></p>}
            {t.tutor?.bio && <p className="mt-2 text-sm leading-relaxed text-muted">{t.tutor.bio}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
