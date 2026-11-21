import type { Metadata } from "next";
import { PricingCards } from "@/components/home/pricing-cards";
import { Faq } from "@/components/home/faq";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center"><h1 className="text-5xl font-bold tracking-tight">Plans for students and tutors</h1><p className="mt-3 text-muted">Browsing and applying are always free. Upgrade to Pro when you need more. Payments are processed securely by Stripe.</p></div>
      <PricingCards />
      <h2 className="mb-8 mt-24 text-center text-3xl font-bold tracking-tight">Questions about plans</h2>
      <Faq />
    </div>
  );
}
