"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu, dashboardHref, signOut, type SessionUser } from "./user-menu";
import { ButtonLink, Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/misc";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;
  // The menu is "open" only for the page it was opened on, so navigating closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (fn: (o: boolean) => boolean) => setOpenFor(fn(open) ? pathname : null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={cn("sticky top-0 z-40 transition-all duration-300", scrolled ? "border-b border-border bg-background/85 shadow-sm backdrop-blur-md" : "bg-transparent")}>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className={cn("relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-accent-text", active(l.href) ? "text-ink" : "text-muted")}>
                {l.label}
                {active(l.href) && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent" />}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 lg:flex">
            {isPending ? (
              <Skeleton className="h-10 w-40 rounded-full" />
            ) : user ? (
              <>
                <ButtonLink href={dashboardHref(user.role)} variant="ghost" size="sm">Dashboard</ButtonLink>
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <ButtonLink href="/sign-in" variant="ghost" size="sm">Sign In</ButtonLink>
                <ButtonLink href="/sign-up" size="sm">Sign Up</ButtonLink>
              </>
            )}
          </div>
          <button className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-surface lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-b border-border bg-background lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-5 pt-2 sm:px-6">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={cn("rounded-xl px-4 py-3 text-base font-medium", active(l.href) ? "bg-surface text-ink" : "text-muted")}>{l.label}</Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <Link href={dashboardHref(user.role)} className="flex items-center gap-2 rounded-xl px-4 py-3 font-medium"><LayoutDashboard className="size-4" /> Dashboard</Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-xl px-4 py-3 font-medium"><UserRound className="size-4" /> Update profile</Link>
                    <Button variant="outline" onClick={() => void signOut(router)}><LogOut className="size-4" /> Sign out</Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <ButtonLink href="/sign-in" variant="outline">Sign In</ButtonLink>
                    <ButtonLink href="/sign-up">Sign Up</ButtonLink>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
