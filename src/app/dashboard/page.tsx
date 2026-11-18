import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/session";

export default async function DashboardIndex() {
  const user = await getServerUser();
  redirect(user ? `/dashboard/${user.role}` : "/sign-in");
}
