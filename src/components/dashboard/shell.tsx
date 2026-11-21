"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, CircleDollarSign, FileText, LayoutDashboard, ListChecks, LogOut, Menu, PanelLeftClose, PanelLeftOpen, PlusCircle, ShieldCheck, UserRound, Users, X, Home, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/api";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, RoleBadge, signOut } from "@/components/layout/user-menu";
import { authClient } from "@/lib/auth-client";

const nav: Record<Role, { href: string; label: string; Icon: typeof Home }[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/student/my-applications", label: "My Applications", Icon: FileText },
    { href: "/dashboard/student/saved-tuitions", label: "Saved Tuitions", Icon: Bookmark },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/tutor/post-tuition", label: "Post a Tuition", Icon: PlusCircle },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", Icon: ListChecks },
    { href: "/dashboard/tutor/applicants", label: "Applicants", Icon: ClipboardList },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", Icon: Users },
    { href: "/dashboard/admin/tuitions", label: "Tuition Approvals", Icon: ShieldCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", Icon: CircleDollarSign },
  ],
};

interface User { name: string; email: string; image?: string | null; role: Role }

function NavList({ role, collapsed, onNavigate }: { role: Role; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = [...nav[role], { href: "/dashboard/profile", label: "Update Profile", Icon: UserRound }];
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} onClick={onNavigate} title={collapsed ? label : undefined} aria-current={active ? "page" : undefined}
            className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface hover:text-ink", collapsed && "justify-center")}>
            <Icon className="size-[18px] shrink-0" aria-hidden />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ user, children }: { user: User; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const live = (session?.user as Partial<User> | undefined) ?? {};
  const me = { ...user, ...(live.image !== undefined ? { image: live.image } : {}), ...(live.name ? { name: live.name } : {}) };

  const sidebar = (c: boolean, onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className={cn("flex items-center", c ? "justify-center" : "justify-between")}>{c ? <Logo className="[&>span:last-child]:hidden" /> : <Logo />}</div>
      <div className={cn("rounded-2xl bg-surface p-3", c && "p-2")}>
        <div className={cn("flex items-center gap-3", c && "justify-center")}>
          <Avatar user={me} size={c ? 36 : 44} />
          {!c && <div className="min-w-0"><p className="truncate text-sm font-semibold">{me.name}</p><RoleBadge role={me.role} /></div>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto"><NavList role={user.role} collapsed={c} onNavigate={onNavigate} /></div>
      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <Link href="/" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-ink", c && "justify-center")}><Home className="size-[18px]" aria-hidden />{!c && "Back to site"}</Link>
        <button onClick={() => void signOut(router)} className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger-soft", c && "justify-center")}><LogOut className="size-[18px]" aria-hidden />{!c && "Sign out"}</button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 border-r border-border bg-card transition-[width] duration-300 lg:block", collapsed ? "w-[84px]" : "w-64")}>{sidebar(collapsed)}</aside>
      <AnimatePresence>
        {mobile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobile(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "tween", duration: 0.25 }} className="fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-2xl lg:hidden" aria-label="Dashboard menu">
              <button className="absolute right-3 top-3 grid size-9 cursor-pointer place-items-center rounded-full hover:bg-surface" aria-label="Close menu" onClick={() => setMobile(false)}><X className="size-5" /></button>
              {sidebar(false, () => setMobile(false))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <button className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-surface lg:hidden" aria-label="Open menu" onClick={() => setMobile(true)}><Menu className="size-5" /></button>
            <button className="hidden size-10 cursor-pointer place-items-center rounded-full hover:bg-surface lg:grid" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-pressed={collapsed} onClick={() => setCollapsed((c) => !c)}>{collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}</button>
          </div>
          <div className="flex items-center gap-3"><ThemeToggle /><div className="hidden items-center gap-2 sm:flex"><Avatar user={me} size={34} /><div className="leading-tight"><p className="text-sm font-semibold">{me.name}</p><p className="text-xs capitalize text-muted">{me.role}</p></div></div></div>
        </header>
        <main className="wash wash-lilac flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
