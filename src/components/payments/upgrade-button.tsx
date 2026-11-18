"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

/** Starts a real Stripe Checkout session via the server. The plan is decided by the server from the signed-in role. */
export function UpgradeButton({ audience, highlight }: { audience: "tutor" | "student"; highlight?: boolean }) {
  const { data: session } = authClient.useSession();
  const user = session?.user as { role?: string; plan?: string } | undefined;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!user) { toast.info(`Sign in as a ${audience} to subscribe`); router.push("/sign-in"); return; }
    if (user.role !== audience) { toast.error(`${audience === "tutor" ? "Tutor" : "Student"} Pro is only available to ${audience} accounts`); return; }
    setLoading(true);
    try {
      const res = await api<{ url: string }>("/payments/checkout", { method: "POST", body: {} });
      window.location.href = res.data.url;
    } catch (e) {
      toast.error((e as Error).message);
      setLoading(false);
    }
  }
  return (
    <Button onClick={onClick} loading={loading} variant={highlight ? "accent" : "primary"} size="lg" className="mt-6 w-full">
      Subscribe with Stripe
    </Button>
  );
}
