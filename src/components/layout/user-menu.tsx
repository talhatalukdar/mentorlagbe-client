"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { Badge } from "@/components/ui/misc";
import type { Role } from "@/types/api";

export interface SessionUser { name: string; email: string; image?: string | null; role?: Role }
export const dashboardHref = (role?: Role) => `/dashboard/${role ?? "student"}`;

export function Avatar({ user, size = 36 }: { user: Pick<SessionUser, "name" | "image">; size?: number }) {
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return user.image ? (
    <Image src={user.image} alt={user.name} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span className="grid place-items-center rounded-full bg-accent-soft font-semibold text-accent-text" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</span>
  );
}

export function RoleBadge({ role }: { role?: Role }) {
  return <Badge tone={role === "admin" ? "danger" : role === "tutor" ? "info" : "accent"} className="capitalize">{role ?? "student"}</Badge>;
}

export async function signOut(router: ReturnType<typeof useRouter>) {
  await authClient.signOut();
  clearTokenCache();
  toast.success("Signed out successfully");
  router.push("/");
  router.refresh();
}

export function UserMenu({ user }: { user: SessionUser }) {
  const router = useRouter();
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3 transition-colors hover:border-ink/30" aria-label="Open account menu">
        <Avatar user={user} />
        <span className="hidden max-w-28 truncate text-sm font-medium md:block">{user.name}</span>
        <RoleBadge role={user.role} />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={8} className="z-50 w-60 rounded-2xl border border-border bg-card p-2 shadow-xl">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <Dropdown.Separator className="my-1 h-px bg-border" />
          <Dropdown.Item asChild><Link href={dashboardHref(user.role)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface"><LayoutDashboard className="size-4" /> Dashboard</Link></Dropdown.Item>
          <Dropdown.Item asChild><Link href="/dashboard/profile" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface"><UserRound className="size-4" /> Update profile</Link></Dropdown.Item>
          <Dropdown.Item onSelect={() => void signOut(router)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger outline-none data-[highlighted]:bg-danger-soft"><LogOut className="size-4" /> Sign out</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
