"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ButtonLink } from "@/components/ui/button";

type State = { kind: "loading" } | { kind: "paid" } | { kind: "unpaid" } | { kind: "error"; message: string };

function Verify() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState<State>({ kind: "loading" });
  const qc = useQueryClient();
  useEffect(() => {
    if (!sessionId) { setState({ kind: "error", message: "No checkout session was found in this link." }); return; }
    // We never trust the redirect itself: the server asks Stripe whether this session is actually paid.
    api<{ paid: boolean; plan: string }>("/payments/verify", { query: { session_id: sessionId } })
      .then((r) => { setState(r.data.paid ? { kind: "paid" } : { kind: "unpaid" }); void qc.invalidateQueries({ queryKey: ["me"] }); })
      .catch((e: Error) => setState({ kind: "error", message: e.message }));
  }, [sessionId, qc]);

  const box = "mx-auto max-w-md text-center";
  if (state.kind === "loading") return <div className={box} role="status"><Loader2 className="mx-auto size-10 animate-spin text-accent" /><h1 className="mt-6 text-2xl font-bold">Confirming your payment…</h1><p className="mt-2 text-muted">Checking with Stripe. This takes a moment.</p></div>;
  if (state.kind === "paid") return <div className={box}><CheckCircle2 className="mx-auto size-14 text-success" /><h1 className="mt-6 text-3xl font-bold">You’re now on Pro</h1><p className="mt-2 text-muted">Payment confirmed. Your Pro benefits are active.</p><ButtonLink href="/dashboard" size="lg" className="mt-8">Go to dashboard</ButtonLink></div>;
  return <div className={box}><CircleAlert className="mx-auto size-14 text-warning" /><h1 className="mt-6 text-2xl font-bold">{state.kind === "unpaid" ? "Payment not completed yet" : "We couldn’t confirm this payment"}</h1><p className="mt-2 text-muted">{state.kind === "error" ? state.message : "Stripe has not marked this session as paid. If you were charged, your plan will update automatically in a few minutes."}</p><div className="mt-8 flex justify-center gap-3"><ButtonLink href="/pricing" variant="outline">Back to pricing</ButtonLink><ButtonLink href="/dashboard">Dashboard</ButtonLink></div></div>;
}

export default function PaymentSuccess() {
  return <div className="grid min-h-screen place-items-center px-4"><Suspense><Verify /></Suspense></div>;
}
