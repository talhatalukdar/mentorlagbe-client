import { requireRole } from "@/lib/session";

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  await requireRole("tutor");
  return <>{children}</>;
}
