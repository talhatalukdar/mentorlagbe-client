"use client";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { api } from "@/lib/api";
import type { Tuition } from "@/types/api";
import { PageHeader } from "@/components/dashboard/parts";
import { TuitionCard, TuitionCardSkeleton } from "@/components/tuition/tuition-card";
import { EmptyState, ErrorState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";

export default function SavedTuitions() {
  const q = useQuery({ queryKey: ["saved"], queryFn: async () => (await api<Tuition[]>("/student/saved")).data });
  return (
    <>
      <PageHeader title="Saved tuitions" description="Listings you bookmarked. Remove one with the bookmark icon." />
      {q.isPending ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <TuitionCardSkeleton key={i} />)}</div> : q.isError ? <ErrorState message={q.error.message} onRetry={() => void q.refetch()} /> : q.data.length === 0 ? (
        <EmptyState icon={<Bookmark className="size-6" />} title="Nothing saved yet" description="Tap the bookmark icon on any tuition to keep it here for later." action={<ButtonLink href="/tuitions">Browse tuitions</ButtonLink>} />
      ) : <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{q.data.map((t) => <TuitionCard key={t._id} t={t} />)}</div>}
    </>
  );
}
