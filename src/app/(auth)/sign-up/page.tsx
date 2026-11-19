"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters").max(64),
  role: z.enum(["student", "tutor"]),
});
type Values = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { role: "student" } });
  const role = useWatch({ control, name: "role" });

  async function onSubmit(v: Values) {
    const res = await authClient.signUp.email({ name: v.name, email: v.email, password: v.password, role: v.role } as Parameters<typeof authClient.signUp.email>[0]);
    if (res.error) return void toast.error(res.error.message ?? "Could not create your account");
    toast.success("Account created — welcome to MentorLagbe!");
    router.push(`/dashboard/${v.role}`);
    router.refresh();
  }

  return (
    <AuthShell title="Create your account" subtitle="Join as a student to find tutors, or as a tutor to post your batches.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">I am a</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
            {(["student", "tutor"] as const).map((r) => (
              <button type="button" key={r} role="radio" aria-checked={role === r} onClick={() => setValue("role", r)} className={cn("cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-colors", role === r ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-ink/40")}>{r}</button>
            ))}
          </div>
        </fieldset>
        <Field label="Full name" htmlFor="name" error={errors.name?.message}><Input id="name" autoComplete="name" {...register("name")} /></Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" {...register("email")} /></Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters">
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="new-password" className="pr-11" {...register("password")} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted hover:text-ink">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
          </div>
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link href="/sign-in" className="font-semibold text-accent-text hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}
