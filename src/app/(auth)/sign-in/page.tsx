"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

const schema = z.object({ email: z.string().trim().email("Enter a valid email address"), password: z.string().min(1, "Enter your password") });
type Values = z.infer<typeof schema>;

function SignInForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(v: Values) {
    const res = await authClient.signIn.email({ email: v.email, password: v.password });
    if (res.error) return void toast.error(res.error.message === "Invalid email or password" || res.error.status === 401 ? "Incorrect email or password" : res.error.message ?? "Could not sign you in");
    toast.success("Signed in successfully");
    const role = (res.data?.user as { role?: string } | undefined)?.role ?? "student";
    router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : `/dashboard/${role}`);
    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" {...register("email")} /></Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="pr-11" {...register("password")} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted hover:text-ink">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
          </div>
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">New to MentorLagbe? <Link href="/sign-up" className="font-semibold text-accent-text hover:underline">Create an account</Link></p>
    </>
  );
}

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your applications, listings or platform.">
      <Suspense><SignInForm /></Suspense>
    </AuthShell>
  );
}
