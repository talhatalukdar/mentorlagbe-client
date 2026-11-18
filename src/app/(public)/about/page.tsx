import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">About MentorLagbe</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>Students and parents in Bangladesh often search for tutors through scattered social media groups and word of mouth. Skilled tutors, meanwhile, have no structured place to show their batches and manage enrolments.</p>
        <p>MentorLagbe brings both sides together. Tutors post subject-wise batches and one-to-one mentorship. Admins review each listing before it goes public. Students search by subject, class level, mode and monthly budget, apply in minutes, and follow their application status.</p>
        <p>The platform is free to browse and apply. Tutors and students can upgrade to Pro plans billed through Stripe.</p>
      </div>
      <ButtonLink href="/tuitions" className="mt-8">Browse tuitions</ButtonLink>
    </div>
  );
}
