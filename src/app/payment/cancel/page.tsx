import { XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function PaymentCancel() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div className="max-w-md">
        <XCircle className="mx-auto size-14 text-muted" aria-hidden />
        <h1 className="mt-6 text-3xl font-bold">Checkout cancelled</h1>
        <p className="mt-2 text-muted">No payment was made and you were not charged. You can upgrade any time.</p>
        <div className="mt-8 flex justify-center gap-3"><ButtonLink href="/pricing" size="lg">Back to pricing</ButtonLink><ButtonLink href="/" variant="outline" size="lg">Home</ButtonLink></div>
      </div>
    </div>
  );
}
