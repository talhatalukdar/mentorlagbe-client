import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "How It Works" };

const flows = [
  { title: "For students", steps: ["Create a free student account.", "Search approved tuitions by subject, class level, mode and budget.", "Open a listing and apply with your phone number, preferred schedule and a note.", "Track the status of every application from your dashboard — cancel any that are still pending.", "After a tutor accepts you, rate the tuition to help other students."] },
  { title: "For tutors", steps: ["Create a tutor account and complete your profile.", "Post a tuition with a banner image. Free tutors can post 2 listings; Pro tutors post unlimited.", "An admin reviews the listing. Once approved it appears on Browse Tuitions.", "Review applicants and accept or reject them from your dashboard.", "Close a listing whenever your batch is full."] },
  { title: "Behind the scenes", steps: ["Admins approve or reject every listing before it goes public.", "Admins manage users and can mark tutors as verified.", "Pro subscriptions are billed through Stripe and recorded as transactions."] },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">How MentorLagbe works</h1>
      <p className="mt-3 max-w-2xl text-muted">One platform for students looking for tutors and tutors looking for students, with admin moderation to keep listings trustworthy.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {flows.map((f) => (
          <section key={f.title} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">{f.title}</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted">{f.steps.map((s, i) => <li key={s} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-violet-soft text-xs font-bold text-primary">{i + 1}</span><span>{s}</span></li>)}</ol>
          </section>
        ))}
      </div>
      <div className="mt-10 flex gap-3"><ButtonLink href="/tuitions">Browse tuitions</ButtonLink><ButtonLink href="/sign-up" variant="outline">Create an account</ButtonLink></div>
    </div>
  );
}
