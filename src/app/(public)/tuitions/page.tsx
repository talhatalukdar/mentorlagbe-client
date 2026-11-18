import { Suspense } from "react";
import type { Metadata } from "next";
import { Browse } from "@/components/tuition/browse";
import { TuitionCardSkeleton } from "@/components/tuition/tuition-card";

export const metadata: Metadata = { title: "Browse Tuitions" };

export default function TuitionsPage() {
  return (
    <Suspense fallback={<div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <TuitionCardSkeleton key={i} />)}</div>}>
      <Browse />
    </Suspense>
  );
}
