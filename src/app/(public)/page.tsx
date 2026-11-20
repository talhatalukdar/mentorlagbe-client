import Link from "next/link";
import { ArrowRight, BadgeCheck, GraduationCap, MessageSquareText, Search, ShieldCheck, Star, UserRoundCheck, Wallet } from "lucide-react";
import { serverApi } from "@/lib/api";
import type { Tuition } from "@/types/api";
import { HeroIllustration } from "@/components/home/hero-illustration";
import { TuitionCard } from "@/components/tuition/tuition-card";
import { SubjectImage } from "@/components/tuition/subject-image";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Badge, EmptyState } from "@/components/ui/misc";
import { Hl } from "@/components/ui/hl";
import { PricingCards } from "@/components/home/pricing-cards";
import { Faq } from "@/components/home/faq";
import { SUBJECTS } from "@/lib/site";
import { HeroSearch } from "@/components/home/hero-search";

const steps = [
  { Icon: Search, title: "Search", text: "Filter approved tuitions by subject, class level, mode and budget.", badge: "bg-primary", soft: "bg-violet-soft text-primary" },
  { Icon: MessageSquareText, title: "Apply", text: "Send your phone number, preferred schedule and a short learning note.", badge: "bg-accent", soft: "bg-accent-soft text-accent-text" },
  { Icon: UserRoundCheck, title: "Get accepted", text: "The tutor reviews your application and accepts or declines it.", badge: "bg-sky", soft: "bg-sky-soft text-sky" },
  { Icon: GraduationCap, title: "Start learning", text: "Begin classes, then rate your tutor to help other students.", badge: "bg-mint", soft: "bg-mint-soft text-mint" },
];

const sampleTestimonials = [
  { quote: "I found a Physics batch in Mirpur within a day. The schedule filter saved me a lot of time.", who: "Sample student feedback", edge: "border-t-primary" },
  { quote: "Posting my batch and managing applicants from one dashboard is much easier than Facebook groups.", who: "Sample tutor feedback", edge: "border-t-accent" },
  { quote: "As a parent I like that every listing is checked by an admin before it goes live.", who: "Sample guardian feedback", edge: "border-t-mint" },
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
            <h1 className="text-5xl sm:text-6xl lg:text-7xl">
              Find your <Hl tone="gradient">ideal tutor</Hl> or <Hl tone="sky">mentorship</Hl> <Hl tone="pink">batch</Hl> today
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">Search verified tuition listings across Bangladesh by subject, class level and budget — online from home or offline near you.</p>
            <HeroSearch />
            <div className="mt-8 flex items-center gap-4 text-sm text-muted">
              <span className="grid size-11 place-items-center rounded-xl bg-amber-soft"><Star className="size-5 fill-star text-star" aria-hidden /></span>
              <p>{totalListings > 0 ? <><strong className="text-ink">{totalListings} approved tuitions</strong> across {counts.size} subjects are open right now.</> : "Approved tuition listings appear here as soon as tutors post them."}</p>
            </div>
          </div>
          <div className="relative animate-[rise_0.9s_0.1s_ease-out_both]">
            <div className="glow absolute inset-0 scale-110" aria-hidden />
            <HeroIllustration className="relative z-10 mx-auto w-full max-w-xl text-ink" />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl sm:text-5xl">Latest <Hl tone="violet">approved</Hl> <Hl tone="pink">tuitions</Hl></h2>
            <p className="mt-2 max-w-xl text-muted">Freshly posted batches and one-to-one mentorship from tutors across the country.</p>
          </div>
          <ButtonLink href="/tuitions" variant="outline">Browse all tuitions <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></ButtonLink>
        </Reveal>
        {featured?.data?.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((t, i) => (<Reveal key={t._id} delay={i * 0.05} className="h-full"><TuitionCard t={t} /></Reveal>))}
          </div>
        ) : (
          <div className="mt-10"><EmptyState icon={<Search className="size-6" />} title="No tuitions to show yet" description="Approved listings will appear here. If you expected to see some, the server may be starting up — try again in a moment." action={<ButtonLink href="/tuitions" variant="outline">Open Browse Tuitions</ButtonLink>} /></div>
        )}
      </section>

      {/* Subjects — photo tiles */}
      <section className="bg-gradient-to-b from-violet-soft/70 to-transparent py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal><h2 className="text-4xl sm:text-5xl">Browse by <Hl tone="sky">subject</Hl></h2><p className="mt-2 text-muted">Counts show approved tuitions currently open.</p></Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SUBJECTS.map((s, i) => (
              <Reveal key={s} delay={(i % 3) * 0.05} className="h-full">
                <Link href={`/tuitions?subject=${encodeURIComponent(s)}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-violet-soft">
                  <SubjectImage subject={s} alt={`${s} tuition`} sizes="(min-width:640px) 33vw, 50vw" className="transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1d1a45]/80 via-[#1d1a45]/15 to-transparent transition-colors duration-300 group-hover:from-primary/85" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                    <div><p className="text-lg font-semibold sm:text-xl">{s}</p><p className="text-xs text-white/80">{counts.get(s) ?? 0} open</p></div>
                    <ArrowRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center"><h2 className="text-4xl sm:text-5xl">How <Hl tone="gradient">MentorLagbe</Hl> works</h2><p className="mt-2 text-muted">From search to first class in four steps. Tutors post a batch, students apply, and an admin keeps listings trustworthy.</p></Reveal>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, title, text, badge, soft }, i) => (
            <Reveal key={title} delay={i * 0.06} className="h-full">
              <li className="icon-wiggle relative h-full rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/40">
                <span className={`absolute -top-3 left-6 grid size-7 place-items-center rounded-full text-xs font-bold text-white ${badge}`}>{i + 1}</span>
                <span className={`mt-2 grid size-12 place-items-center rounded-xl ${soft}`}><Icon className="wiggle-target size-6" aria-hidden /></span>
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
        <div className="panel-gradient grid gap-8 rounded-3xl p-8 sm:grid-cols-3 sm:p-12">
          {[{ Icon: ShieldCheck, t: "Admin-reviewed listings", d: "Nothing goes public until an admin approves it.", c: "bg-white/20" }, { Icon: BadgeCheck, t: "Verified tutor badge", d: "Admins mark tutors whose details they have checked.", c: "bg-amber/90" }, { Icon: Wallet, t: "Transparent pricing", d: "Free to browse and apply. Pro plans are billed through Stripe.", c: "bg-mint/90" }].map(({ Icon, t, d, c }) => (
            <div key={t}><span className={`grid size-12 place-items-center rounded-xl text-white ${c}`}><Icon className="size-6" aria-hidden /></span><h3 className="mt-4 text-2xl">{t}</h3><p className="mt-1 text-sm text-white/80">{d}</p></div>
          ))}
        </div>
      </section>

      {/* Testimonials (clearly labelled sample content) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="flex flex-wrap items-center gap-3"><h2 className="text-4xl sm:text-5xl">What <Hl tone="pink">people</Hl> say</h2><Badge tone="warning">Sample content</Badge></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {sampleTestimonials.map((t, i) => (
            <Reveal key={t.who} delay={i * 0.06} className="h-full">
              <figure className={`flex h-full flex-col rounded-2xl border border-border border-t-4 bg-card p-6 ${t.edge}`}>
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-4 fill-star text-star" />)}</div>
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted">{t.who}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gradient-to-b from-accent-soft/60 via-violet-soft/60 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center"><h2 className="text-4xl sm:text-5xl">Simple plans for <Hl tone="violet">students</Hl> and <Hl tone="mint">tutors</Hl></h2><p className="mt-2 text-muted">Start free. Upgrade when you need more.</p></Reveal>
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mb-10 text-center"><h2 className="text-4xl sm:text-5xl">Frequently asked <Hl tone="amber">questions</Hl></h2></Reveal>
        <Faq />
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="panel-gradient relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12">
          <div className="glow absolute inset-0 opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-4xl sm:text-5xl">Ready to find the right tutor — or your next students?</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/tuitions" variant="accent" size="lg">Find a tutor</ButtonLink>
              <ButtonLink href="/sign-up" variant="outline" size="lg" className="border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white">Become a tutor</ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
