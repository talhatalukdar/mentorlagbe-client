"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import type { Application } from "@/types/api";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/misc";
import { Field, Input, Textarea } from "@/components/ui/form";

const schema = z.object({
  studentPhone: z.string().trim().regex(/^[+\d][\d\s-]{5,19}$/, "Enter a valid phone number"),
  preferredSchedule: z.string().trim().min(3, "Tell the tutor when you are free").max(200),
  studentNote: z.string().trim().min(5, "Write at least 5 characters").max(800),
});
type Values = z.infer<typeof schema>;

export function ApplyPanel({ tuitionId, closedNote }: { tuitionId: string; closedNote?: string }) {
  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const qc = useQueryClient();
  const isStudent = role === "student";

  const { data: mine } = useQuery({ queryKey: ["my-applications", "all"], enabled: isStudent, queryFn: async () => (await api<Application[]>("/student/applications", { query: { limit: 50 } })).data });
  const existing = mine?.find((a) => a.tuitionId === tuitionId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  const apply = useMutation({
    mutationFn: (v: Values) => api("/student/applications", { method: "POST", body: { tuitionId, ...v } }),
    onSuccess: () => { toast.success("Application submitted"); reset(); void qc.invalidateQueries({ queryKey: ["my-applications"] }); void qc.invalidateQueries({ queryKey: ["student-stats"] }); },
    onError: (e) => toast.error(e.message),
  });

  const shell = "rounded-2xl border border-border bg-card p-6";
  if (isPending) return <div className={`${shell} h-48 animate-pulse`} />;
  if (closedNote) return <div className={shell}><p className="text-sm text-muted">{closedNote}</p></div>;
  if (!session) return (
    <div className={shell}>
      <h2 className="text-lg font-semibold">Apply for this tuition</h2>
      <p className="mt-1 text-sm text-muted">Sign in with a student account to send your application.</p>
      <div className="mt-4 grid grid-cols-2 gap-2"><ButtonLink href="/sign-in" variant="outline">Sign In</ButtonLink><ButtonLink href="/sign-up">Sign Up</ButtonLink></div>
    </div>
  );
  if (!isStudent) return (
    <div className={shell}>
      <h2 className="text-lg font-semibold">Apply for this tuition</h2>
      <Button disabled className="mt-4 w-full">Apply Now</Button>
      <p className="mt-3 flex gap-2 text-sm text-muted"><Info className="mt-0.5 size-4 shrink-0" aria-hidden />Only student accounts can apply. You are signed in as {role === "tutor" ? "a tutor" : "an admin"}.</p>
    </div>
  );
  if (existing) return (
    <div className={shell}>
      <h2 className="text-lg font-semibold">You have applied</h2>
      <p className="mt-2 text-sm text-muted">Status: <Badge tone={statusTone(existing.status)} className="capitalize">{existing.status}</Badge></p>
      <Link href="/dashboard/student/my-applications" className="mt-4 inline-block text-sm font-medium text-accent-text hover:underline">View my applications</Link>
    </div>
  );
  return (
    <form onSubmit={handleSubmit((v) => apply.mutate(v))} className={`${shell} space-y-4`} noValidate>
      <h2 className="text-lg font-semibold">Apply for this tuition</h2>
      <Field label="Phone number" htmlFor="studentPhone" error={errors.studentPhone?.message}><Input id="studentPhone" inputMode="tel" placeholder="01XXXXXXXXX" {...register("studentPhone")} /></Field>
      <Field label="Preferred schedule" htmlFor="preferredSchedule" error={errors.preferredSchedule?.message}><Input id="preferredSchedule" placeholder="e.g. Evenings after 6 PM" {...register("preferredSchedule")} /></Field>
      <Field label="Learning note" htmlFor="studentNote" error={errors.studentNote?.message}><Textarea id="studentNote" placeholder="What do you want to learn and what is your current level?" {...register("studentNote")} /></Field>
      <Button type="submit" loading={apply.isPending} className="w-full"><Send className="size-4" />Apply now</Button>
    </form>
  );
}
