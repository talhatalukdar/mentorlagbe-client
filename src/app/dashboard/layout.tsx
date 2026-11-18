import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/sign-in");
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
