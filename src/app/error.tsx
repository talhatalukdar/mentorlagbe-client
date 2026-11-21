"use client";
import { TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-danger-soft text-danger"><TriangleAlert className="size-9" aria-hidden /></div>
        <h1 className="mt-6 text-5xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">An unexpected error occurred. You can try again or head back to the home page.</p>
        <div className="mt-8 flex justify-center gap-3"><Button variant="outline" size="lg" onClick={reset}>Try again</Button><ButtonLink href="/" size="lg">Back to Home</ButtonLink></div>
      </div>
    </div>
  );
}
