"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Crown } from "lucide-react";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { PageHeader } from "@/components/dashboard/parts";
import { useMe } from "@/components/dashboard/use-me";
import { Field, Input, Textarea } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
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

export default function ProfilePage() {
  const me = useMe();
  const qc = useQueryClient();
  const { register, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Values>({ resolver: zodResolver(schema) });
  useEffect(() => {
    const u = me.data;
    if (u) reset({ name: u.name, phone: u.phone, bio: u.bio, image: u.image ?? "", location: u.location, subjects: u.subjects.join(", "), education: u.education, experience: u.experience, hourlyRate: u.hourlyRate?.toString() ?? "", availability: u.availability });
  }, [me.data, reset]);

  const save = useMutation({
    mutationFn: async (v: Values) => {
      const body: Record<string, unknown> = { name: v.name, phone: v.phone, bio: v.bio, image: v.image };
      if (me.data?.role === "tutor") Object.assign(body, { location: v.location, subjects: v.subjects.split(",").map((s) => s.trim()).filter(Boolean), education: v.education, experience: v.experience, availability: v.availability, ...(v.hourlyRate ? { hourlyRate: Number(v.hourlyRate) } : {}) });
      const res = await api("/me", { method: "PATCH", body });
      await authClient.updateUser({ name: v.name, image: v.image || null }); // keep the navbar/session in sync
      return res;
    },
    onSuccess: () => { toast.success("Profile updated"); void qc.invalidateQueries({ queryKey: ["me"] }); },
    onError: (e) => toast.error(e.message),
  });

  if (me.isPending) return <Skeleton className="h-96 max-w-3xl" />;
  const isTutor = me.data?.role === "tutor";
  return (
    <>
      <PageHeader title="Update profile" description="Keep your details current so tutors and students can trust your profile." />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_280px]">
        <form onSubmit={handleSubmit((v) => save.mutate(v))} className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8" noValidate>
          <div>
            <span className="mb-2 block text-sm font-medium">Profile picture</span>
            <Controller control={control} name="image" render={({ field }) => <ImageUpload shape="round" label="Upload" value={field.value} onChange={(u) => { field.onChange(u); }} />} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="name" error={errors.name?.message}><Input id="name" {...register("name")} /></Field>
            <Field label="Email" htmlFor="email" hint="Email can’t be changed"><Input id="email" value={me.data?.email ?? ""} disabled readOnly /></Field>
            <Field label="Phone" htmlFor="phone" error={errors.phone?.message}><Input id="phone" inputMode="tel" placeholder="01XXXXXXXXX" {...register("phone")} /></Field>
            {isTutor && <Field label="Location" htmlFor="location" error={errors.location?.message}><Input id="location" placeholder="e.g. Mirpur, Dhaka" {...register("location")} /></Field>}
          </div>
          <Field label="Bio" htmlFor="bio" error={errors.bio?.message}><Textarea id="bio" placeholder="Tell students a little about yourself" {...register("bio")} /></Field>
          {isTutor && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Subjects you teach" htmlFor="subjects" hint="Separate with commas"><Input id="subjects" placeholder="Physics, Mathematics" {...register("subjects")} /></Field>
              <Field label="Hourly rate (৳)" htmlFor="hourlyRate" error={errors.hourlyRate?.message}><Input id="hourlyRate" inputMode="numeric" {...register("hourlyRate")} /></Field>
              <Field label="Education" htmlFor="education"><Input id="education" placeholder="e.g. BSc in Physics, Dhaka University" {...register("education")} /></Field>
              <Field label="Experience" htmlFor="experience"><Input id="experience" placeholder="e.g. 5 years teaching HSC Physics" {...register("experience")} /></Field>
              <div className="sm:col-span-2"><Field label="Availability" htmlFor="availability"><Input id="availability" placeholder="e.g. Weekday evenings, weekends" {...register("availability")} /></Field></div>
            </div>
          )}
          <Button type="submit" size="lg" loading={save.isPending} disabled={!isDirty}>Save changes</Button>
        </form>
        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2"><RoleBadge role={me.data?.role} />{isTutor && me.data?.isVerified && <Badge tone="info"><BadgeCheck className="size-3" />Verified</Badge>}</div>
          <div><p className="text-sm text-muted">Current plan</p><p className="flex items-center gap-2 text-xl font-bold capitalize">{me.data?.plan === "pro" && <Crown className="size-5 text-star" />}{me.data?.plan}</p></div>
          {me.data?.plan === "free" && me.data.role !== "admin" && <Link href="/pricing" className="inline-block text-sm font-semibold text-accent-text hover:underline">Upgrade to Pro</Link>}
        </aside>
      </div>
    </>
  );
}
