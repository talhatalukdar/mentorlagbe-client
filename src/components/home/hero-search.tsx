import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Plain GET form → works without JavaScript and lands on the server-filtered Browse page. */
export function HeroSearch() {
  return (
    <form action="/tuitions" role="search" className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25">
      <Search className="ml-4 size-5 shrink-0 text-muted" aria-hidden />
      <input name="search" aria-label="Search tuitions by title or subject" placeholder="Try “Physics HSC” or “Python”" className="h-11 min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted/70" />
      <Button type="submit" className="shrink-0">Search</Button>
    </form>
  );
}
