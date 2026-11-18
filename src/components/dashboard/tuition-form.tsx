"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CLASS_LEVELS, SUBJECTS } from "@/lib/site";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import type { Tuition } from "@/types/api";

export const tuitionSchema = z.object({
  title: z.string().trim().min(5, "Title needs at least 5 characters").max(120),
  subject: z.string().min(1, "Choose a subject"),
  classLevel: z.enum(CLASS_LEVELS, { message: "Choose a class level" }),
  mode: z.enum(["Online", "Offline"], { message: "Choose a mode" }),
  location: z.string().trim().min(2, "Enter a location").max(100),
  monthlyFee: z.coerce.number({ message: "Enter a number" }).int("Whole numbers only").min(0).max(1_000_000),
  daysPerWeek: z.coerce.number({ message: "Enter a number" }).int().min(1, "1–7 days").max(7, "1–7 days"),
  schedule: z.string().trim().max(200).optional(),
  description: z.string().trim().min(20, "Describe the tuition in at least 20 characters").max(2000),
  bannerImage: z.string().default(""),
});
export type TuitionValues = z.input<typeof tuitionSchema>;
type Parsed = z.output<typeof tuitionSchema>;

export function TuitionForm({ initial, submitLabel, onSubmit, loading }: { initial?: Tuition; submitLabel: string; loading?: boolean; onSubmit: (v: Parsed) => void | Promise<void> }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<TuitionValues, unknown, Parsed>({
    resolver: zodResolver(tuitionSchema),
    defaultValues: initial ? { title: initial.title, subject: initial.subject, classLevel: initial.classLevel as Parsed["classLevel"], mode: initial.mode, location: initial.location, monthlyFee: initial.monthlyFee, daysPerWeek: initial.daysPerWeek, schedule: initial.schedule ?? "", description: initial.description, bannerImage: initial.bannerImage } : { bannerImage: "", mode: "Online" },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2"><Field label="Title" htmlFor="title" error={errors.title?.message}><Input id="title" placeholder="e.g. HSC Physics — Concept to Problem Solving" {...register("title")} /></Field></div>
      <Field label="Subject" htmlFor="subject" error={errors.subject?.message}><Select id="subject" defaultValue="" {...register("subject")}><option value="" disabled>Select subject</option>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
      <Field label="Class level" htmlFor="classLevel" error={errors.classLevel?.message}><Select id="classLevel" defaultValue="" {...register("classLevel")}><option value="" disabled>Select class level</option>{CLASS_LEVELS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
      <Field label="Mode" htmlFor="mode" error={errors.mode?.message}><Select id="mode" {...register("mode")}><option>Online</option><option>Offline</option></Select></Field>
      <Field label="Location" htmlFor="location" error={errors.location?.message}><Input id="location" placeholder="e.g. Mirpur, Dhaka or Online (Zoom)" {...register("location")} /></Field>
      <Field label="Monthly fee (৳)" htmlFor="monthlyFee" error={errors.monthlyFee?.message}><Input id="monthlyFee" type="number" inputMode="numeric" min={0} {...register("monthlyFee")} /></Field>
      <Field label="Days per week" htmlFor="daysPerWeek" error={errors.daysPerWeek?.message}><Input id="daysPerWeek" type="number" min={1} max={7} {...register("daysPerWeek")} /></Field>
      <div className="sm:col-span-2"><Field label="Schedule (optional)" htmlFor="schedule" error={errors.schedule?.message}><Input id="schedule" placeholder="e.g. Sat, Mon, Wed — 6:00 PM" {...register("schedule")} /></Field></div>
      <div className="sm:col-span-2"><Field label="Description" htmlFor="description" error={errors.description?.message}><Textarea id="description" className="min-h-36" {...register("description")} /></Field></div>
      <div className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-medium">Banner image</span>
        <Controller control={control} name="bannerImage" render={({ field }) => <ImageUpload label="Upload banner image" value={field.value} onChange={field.onChange} />} />
      </div>
      <div className="sm:col-span-2"><Button type="submit" size="lg" loading={loading}>{submitLabel}</Button></div>
    </form>
  );
}
