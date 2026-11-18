import Link from "next/link";
import { ArrowRight, BadgeCheck, GraduationCap, MessageSquareText, Search, ShieldCheck, Star, UserRoundCheck, Wallet } from "lucide-react";
import { serverApi } from "@/lib/api";
import type { Tuition } from "@/types/api";
import { HeroIllustration } from "@/components/home/hero-illustration";
import { TuitionCard } from "@/components/tuition/tuition-card";
import { subjectIcon } from "@/components/tuition/subject-visual";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Badge, EmptyState } from "@/components/ui/misc";
import { PricingCards } from "@/components/home/pricing-cards";
import { Faq } from "@/components/home/faq";
import { SUBJECTS } from "@/lib/site";
import { HeroSearch } from "@/components/home/hero-search";

const steps = [
  { Icon: Search, title: "Search", text: "Filter approved tuitions by subject, class level, mode and budget." },
  { Icon: MessageSquareText, title: "Apply", text: "Send your phone number, preferred schedule and a short learning note." },
  { Icon: UserRoundCheck, title: "Get accepted", text: "The tutor reviews your application and accepts or declines it." },
  { Icon: GraduationCap, title: "Start learning", text: "Begin classes, then rate your tutor to help other students." },
];

const sampleTestimonials = [
  { quote: "I found a Physics batch in Mirpur within a day. The schedule filter saved me a lot of time.", who: "Sample student feedback" },
  { quote: "Posting my batch and managing applicants from one dashboard is much easier than Facebook groups.", who: "Sample tutor feedback" },
  { quote: "As a parent I like that every listing is checked by an admin before it goes live.", who: "Sample guardian feedback" },
];

export default async function HomePage() {
  const [featured, stats] = await Promise.all([
    serverApi<Tuition[]>("/tuitions/featured"),
    serverApi<{ subject: string; count: number }[]>("/tuitions/subjects/stats"),
  ]);
  const counts = new Map((stats?.data ?? []).map((s) => [s.subject, s.count]));
  const totalListings = (stats?.data ?? []).reduce((s, r) => s + r.count, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-14">
          <div className="animate-[rise_0.7s_ease-out_both]">
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Find your ideal tutor or mentorship batch today</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">Search verified tuition listings across Bangladesh by subject, class level and budget — online from home or offline near you.</p>
            <HeroSearch />
            <div className="mt-8 flex items-center gap-4 text-sm text-muted">
              <span className="grid size-11 place-items-center rounded-xl bg-star/20"><Star className="size-5 fill-star text-star" aria-hidden /></span>
              <p>{totalListings > 0 ? <><strong className="text-ink">{totalListings} approved tuitions</strong> across {counts.size} subjects are open right now.</> : "Approved tuition listings appear here as soon as tutors post them."}</p>
            </div>
          </div>
          <div className="relative animate-[rise_0.9s_0.1s_ease-out_both]">
            <div className="glow absolute inset-0 -z-0 scale-110" aria-hidden />
            <HeroIllustration className="relative z-10 mx-auto w-full max-w-xl text-ink" />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest approved tuitions</h2>
            <p className="mt-2 max-w-xl text-muted">Freshly posted batches and one-to-one mentorship from tutors across the country.</p>
          </div>
          <ButtonLink href="/tuitions" variant="outline">Browse all tuitions <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></ButtonLink>
        </Reveal>
        {featured?.data?.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((t, i) => (<Reveal key={t._id} delay={i * 0.06} className="h-full"><TuitionCard t={t} /></Reveal>))}
          </div>
        ) : (
          <div className="mt-10"><EmptyState icon={<Search className="size-6" />} title="No tuitions to show yet" description="Approved listings will appear here. If you expected to see some, the server may be starting up — try again in a moment." action={<ButtonLink href="/tuitions" variant="outline">Open Browse Tuitions</ButtonLink>} /></div>
        )}
      </section>

      {/* Subjects */}
      <section className="bg-surface/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse by subject</h2><p className="mt-2 text-muted">Counts show approved tuitions currently open.</p></Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SUBJECTS.map((s, i) => {
              const Icon = subjectIcon(s);
              return (
                <Reveal key={s} delay={i * 0.04} className="h-full">
                  <Link href={`/tuitions?subject=${encodeURIComponent(s)}`} className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50">
                    <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-text transition-transform group-hover:scale-110"><Icon className="size-5" aria-hidden /></span>
                    <span className="font-semibold">{s}</span>
                    <span className="text-sm text-muted">{counts.get(s) ?? 0} open</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbered */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How MentorLagbe works</h2><p className="mt-2 text-muted">From search to first class in four steps. Tutors post a batch, students apply, and an admin keeps listings trustworthy.</p></Reveal>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <li className="relative h-full rounded-2xl border border-border bg-card p-6">
                <span className="absolute -top-3 left-6 grid size-7 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">{i + 1}</span>
                <Icon className="mt-2 size-8 text-accent-text" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-8 text-center"><ButtonLink href="/how-it-works" variant="ghost">See the full workflow for students and tutors <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></ButtonLink></Reveal>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-3xl bg-primary p-8 text-primary-foreground sm:grid-cols-3 sm:p-12">
          {[{ Icon: ShieldCheck, t: "Admin-reviewed listings", d: "Nothing goes public until an admin approves it." }, { Icon: BadgeCheck, t: "Verified tutor badge", d: "Admins mark tutors whose details they have checked." }, { Icon: Wallet, t: "Transparent pricing", d: "Free to browse and apply. Pro plans are billed through Stripe." }].map(({ Icon, t, d }) => (
            <div key={t}><Icon className="size-8 text-accent" aria-hidden /><h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="mt-1 text-sm opacity-75">{d}</p></div>
          ))}
        </div>
      </section>

      {/* Testimonials (clearly labelled sample content) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="flex flex-wrap items-center gap-3"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What people say</h2><Badge tone="warning">Sample content</Badge></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {sampleTestimonials.map((t, i) => (
            <Reveal key={t.who} delay={i * 0.08} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-4 fill-star text-star" />)}</div>
                <blockquote className="mt-4 flex-1 leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted">{t.who}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface/70 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple plans for students and tutors</h2><p className="mt-2 text-muted">Start free. Upgrade when you need more.</p></Reveal>
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mb-10 text-center"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2></Reveal>
        <Faq />
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
          <div className="glow absolute inset-0 opacity-40" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Ready to find the right tutor — or your next students?</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/tuitions" variant="accent" size="lg">Find a tutor</ButtonLink>
              <ButtonLink href="/sign-up" variant="outline" size="lg" className="bg-transparent text-inherit hover:bg-white/10">Become a tutor</ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
