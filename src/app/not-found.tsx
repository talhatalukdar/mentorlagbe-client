import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-accent-soft text-accent-text"><SearchX className="size-9" aria-hidden /></div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">The page you are looking for doesn’t exist or has been moved.</p>
        <ButtonLink href="/" size="lg" className="mt-8">Back to Home</ButtonLink>
      </div>
    </div>
  );
}
