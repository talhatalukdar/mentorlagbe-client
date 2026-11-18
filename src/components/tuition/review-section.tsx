"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import type { Application } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";

interface ReviewData { ratingAvg: number; ratingCount: number; reviews: { studentName: string; rating: number; comment: string; createdAt: string }[] }

export function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={cn(size, i <= Math.round(value) ? "fill-star text-star" : "text-border")} />)}</span>;
}

export function ReviewSection({ tuitionId }: { tuitionId: string }) {
  const { data: session } = authClient.useSession();
  const isStudent = (session?.user as { role?: string } | undefined)?.role === "student";
  const qc = useQueryClient();
  const reviews = useQuery({ queryKey: ["reviews", tuitionId], queryFn: async () => (await api<ReviewData>(`/tuitions/${tuitionId}/reviews`, { auth: false })).data });
  const mine = useQuery({ queryKey: ["my-applications", "all"], enabled: isStudent, queryFn: async () => (await api<Application[]>("/student/applications", { query: { limit: 50 } })).data });
  const accepted = mine.data?.some((a) => a.tuitionId === tuitionId && a.status === "accepted");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submit = useMutation({
    mutationFn: () => api(`/student/tuitions/${tuitionId}/reviews`, { method: "POST", body: { rating, comment } }),
    onSuccess: () => { toast.success("Review submitted"); setRating(0); setComment(""); void qc.invalidateQueries({ queryKey: ["reviews", tuitionId] }); },
    onError: (e) => toast.error(e.message),
  });
  const data = reviews.data;

  return (
    <section aria-labelledby="reviews-h" className="mt-12">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="reviews-h" className="text-2xl font-bold">Student reviews</h2>
        {data && data.ratingCount > 0 && <span className="flex items-center gap-2 text-sm"><Stars value={data.ratingAvg} /><strong>{data.ratingAvg.toFixed(1)}</strong><span className="text-muted">({data.ratingCount})</span></span>}
      </div>
      {accepted && (
        <form onSubmit={(e) => { e.preventDefault(); if (!rating) return toast.error("Choose a star rating"); if (comment.trim().length < 5) return toast.error("Write at least 5 characters"); submit.mutate(); }} className="mt-5 space-y-3 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-medium">Your application was accepted — share your experience.</p>
          <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((i) => <button type="button" key={i} role="radio" aria-checked={rating === i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => setRating(i)} className="cursor-pointer rounded p-0.5 transition-transform hover:scale-110"><Star className={cn("size-7", i <= rating ? "fill-star text-star" : "text-border")} /></button>)}
          </div>
          <Textarea aria-label="Review feedback" placeholder="What was the teaching like?" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={600} />
          <Button type="submit" loading={submit.isPending}>Submit review</Button>
        </form>
      )}
      <div className="mt-5 space-y-4">
        {reviews.isPending ? <div className="h-20 animate-pulse rounded-2xl bg-border/60" /> : data && data.reviews.length > 0 ? data.reviews.map((r, i) => (
          <article key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><strong>{r.studentName}</strong><Stars value={r.rating} /></div><time className="text-xs text-muted">{formatDate(r.createdAt)}</time></div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{r.comment}</p>
          </article>
        )) : <p className="text-sm text-muted">No reviews yet. Students whose applications are accepted can leave the first one.</p>}
      </div>
    </section>
  );
}
