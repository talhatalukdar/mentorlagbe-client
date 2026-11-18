"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export const FAQS = [
  ["How do I find a tutor?", "Browse approved tuition listings, filter by subject, class level and mode, then send an application with your phone number, preferred schedule and a short note. The tutor reviews it and accepts or declines."],
  ["Are tutors and listings verified?", "Every listing is reviewed by an admin before it appears publicly. Tutors with the Verified badge have also been checked by our team."],
  ["How much does MentorLagbe cost?", "Browsing and applying are free. Tutors can post 2 listings for free; Tutor Pro ($15/month) removes the limit. Student Pro ($10/month) adds priority booking."],
  ["Can I take classes online?", "Yes. Each listing is marked Online or Offline, and you can filter the browse page by mode."],
  ["What if I want to cancel an application?", "You can cancel any application from your dashboard while it is still pending."],
] as const;

export function Faq() {
  return (
    <Accordion.Root type="single" collapsible className="mx-auto max-w-3xl space-y-3">
      {FAQS.map(([q, a], i) => (
        <Accordion.Item key={q} value={`f${i}`} className="overflow-hidden rounded-2xl border border-border bg-card">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-semibold">
              {q}
              <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_0.2s_ease-out] data-[state=open]:animate-[acc-down_0.25s_ease-out]">
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
