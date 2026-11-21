"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, CheckCircle2, Circle, Crown, Mail, MapPin, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/utils";
import { useMe } from "@/components/dashboard/use-me";
import { Field, Input, Textarea } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, Skeleton } from "@/components/ui/misc";
import { RoleBadge } from "@/components/layout/user-menu";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^([+\d][\d\s-]{5,19})?$/, "Enter a valid phone number"),
  bio: z.string().trim().max(600, "Keep your bio under 600 characters"),
  image: z.string(),
  location: z.string().trim().max(100),
  subjects: z.string().max(300),
  education: z.string().trim().max(200),
  experience: z.string().trim().max(300),
  hourlyRate: z.string().regex(/^\d*$/, "Numbers only"),
  availability: z.string().trim().max(200),
});
type Values = z.infer<typeof schema>;

const labels: Record<keyof Values, string> = { name: "Name", phone: "Phone number", bio: "Bio", image: "Profile picture", location: "Location", subjects: "Subjects", education: "Education", experience: "Experience", hourlyRate: "Hourly rate", availability: "Availability" };

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-6 mt-1 text-sm text-muted">{description}</p>
      {children}
    </section>
  );
}

export default function ProfilePage() {
  const me = useMe();
  const qc = useQueryClient();
  const { register, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Values>({ resolver: zodResolver(schema) });
  useEffect(() => {
    const u = me.data;
    if (u) reset({ name: u.name, phone: u.phone, bio: u.bio, image: u.image ?? "", location: u.location, subjects: u.subjects.join(", "), education: u.education, experience: u.experience, hourlyRate: u.hourlyRate?.toString() ?? "", availability: u.availability });
  }, [me.data, reset]);
  const values = useWatch({ control });

  const save = useMutation({
    mutationFn: async (v: Values) => {
      const body: Record<string, unknown> = { name: v.name, phone: v.phone, bio: v.bio, image: v.image };
      if (me.data?.role === "tutor") Object.assign(body, { location: v.location, subjects: v.subjects.split(",").map((s) => s.trim()).filter(Boolean), education: v.education, experience: v.experience, availability: v.availability, ...(v.hourlyRate ? { hourlyRate: Number(v.hourlyRate) } : {}) });
      const res = await api("/me", { method: "PATCH", body });
      await authClient.updateUser({ name: v.name, image: v.image || null }); // keep navbar/session in sync
      return res;
    },
    onSuccess: () => { toast.success("Profile updated"); void qc.invalidateQueries({ queryKey: ["me"] }); },
    onError: (e) => toast.error(e.message),
  });

  if (me.isPending) return <Skeleton className="h-96 max-w-5xl" />;
  const u = me.data!;
  const isTutor = u.role === "tutor";
  const tracked: (keyof Values)[] = isTutor ? ["image", "name", "phone", "bio", "location", "subjects", "education", "experience", "hourlyRate", "availability"] : ["image", "name", "phone", "bio"];
  const done = tracked.filter((k) => String(values[k] ?? "").trim().length > 0);
  const pct = Math.round((done.length / tracked.length) * 100);
  const missing = tracked.filter((k) => !done.includes(k));

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate className="max-w-6xl">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="wash wash-lilac h-32 bg-gradient-to-r from-violet-soft via-accent-soft to-sky-soft sm:h-40" />
        <div className="flex flex-wrap items-end gap-5 px-6 pb-6 sm:px-8">
          <div className="-mt-14 rounded-full bg-card p-1.5 sm:-mt-16">
            <Controller control={control} name="image" render={({ field }) => <ImageUpload shape="round" label="Add photo" value={field.value} onChange={field.onChange} />} />
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="truncate text-5xl font-bold">{values.name || u.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5"><Mail className="size-4" aria-hidden />{u.email}</span>
              {isTutor && values.location && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{values.location}</span>}
              <span>Joined {formatDate(u.createdAt)}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RoleBadge role={u.role} />
              {isTutor && u.isVerified && <Badge tone="info"><BadgeCheck className="size-3" />Verified</Badge>}
              <Badge tone={u.plan === "pro" ? "accent" : "neutral"}>{u.plan === "pro" && <Crown className="size-3" />}<span className="capitalize">{u.plan}</span> plan</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Section title="Personal details" description="Shown to tutors and students you interact with.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" error={errors.name?.message}><Input id="name" {...register("name")} /></Field>
              <Field label="Email" htmlFor="email" hint="Email can’t be changed"><Input id="email" value={u.email} disabled readOnly /></Field>
              <Field label="Phone" htmlFor="phone" error={errors.phone?.message}><Input id="phone" inputMode="tel" placeholder="01XXXXXXXXX" {...register("phone")} /></Field>
              {isTutor && <Field label="Location" htmlFor="location" error={errors.location?.message}><Input id="location" placeholder="e.g. Mirpur, Dhaka" {...register("location")} /></Field>}
              <div className="sm:col-span-2"><Field label="Bio" htmlFor="bio" error={errors.bio?.message} hint="A short introduction (max 600 characters)"><Textarea id="bio" placeholder="Tell people a little about yourself" {...register("bio")} /></Field></div>
            </div>
          </Section>
          {isTutor && (
            <Section title="Teaching profile" description="Helps students decide whether you are the right tutor.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Subjects you teach" htmlFor="subjects" hint="Separate with commas"><Input id="subjects" placeholder="Physics, Mathematics" {...register("subjects")} /></Field>
                <Field label="Hourly rate (৳)" htmlFor="hourlyRate" error={errors.hourlyRate?.message}><Input id="hourlyRate" inputMode="numeric" {...register("hourlyRate")} /></Field>
                <Field label="Education" htmlFor="education"><Input id="education" placeholder="e.g. BSc in Physics, Dhaka University" {...register("education")} /></Field>
                <Field label="Experience" htmlFor="experience"><Input id="experience" placeholder="e.g. 5 years teaching HSC Physics" {...register("experience")} /></Field>
                <div className="sm:col-span-2"><Field label="Availability" htmlFor="availability"><Input id="availability" placeholder="e.g. Weekday evenings, weekends" {...register("availability")} /></Field></div>
              </div>
            </Section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Profile strength</h2><span className="text-2xl font-bold text-primary">{pct}%</span></div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness"><div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
            <ul className="mt-4 space-y-2 text-sm">
              {missing.length === 0 ? <li className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Your profile is complete</li> : missing.slice(0, 5).map((k) => <li key={k} className="flex items-center gap-2 text-muted"><Circle className="size-4" aria-hidden />Add your {labels[k].toLowerCase()}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Plan</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><ShieldCheck className="size-4 text-mint" aria-hidden />{u.plan === "pro" ? "Pro benefits are active." : u.role === "admin" ? "Admin accounts do not need a plan." : "You are on the Free plan."}</p>
            {u.plan === "free" && u.role !== "admin" && <ButtonLink href="/pricing" size="sm" className="mt-4">Upgrade to Pro</ButtonLink>}
          </div>
        </aside>
      </div>

      <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 px-5 py-3 shadow-lg backdrop-blur">
        <p className="text-sm text-muted">{isDirty ? "You have unsaved changes." : "All changes saved."}</p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" disabled={!isDirty} onClick={() => me.data && reset()}>Discard</Button>
          <Button type="submit" loading={save.isPending} disabled={!isDirty}>Save changes</Button>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted"><Link href="/dashboard" className="hover:underline">Back to dashboard</Link></p>
    </form>
  );
}
