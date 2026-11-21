"use client";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Tuition } from "@/types/api";

/** Bookmark toggle. Only students can save; the saved list is loaded once per session and shared via React Query. */
export function SaveButton({ tuitionId, className }: { tuitionId: string; className?: string }) {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const router = useRouter();
  const qc = useQueryClient();
  const isStudent = role === "student";
  const { data: saved } = useQuery({ queryKey: ["saved"], queryFn: async () => (await api<Tuition[]>("/student/saved")).data, enabled: isStudent });
  const isSaved = !!saved?.some((t) => t._id === tuitionId);

  // The variable is the action being performed (true = save), captured at click time so toasts/cache never read stale state.
  const toggle = useMutation({
    mutationFn: (save: boolean) => api(`/student/saved/${tuitionId}`, { method: save ? "POST" : "DELETE" }),
    onMutate: async (save) => {
      await qc.cancelQueries({ queryKey: ["saved"] });
      const prev = qc.getQueryData<Tuition[]>(["saved"]);
      qc.setQueryData<Tuition[]>(["saved"], (old = []) => (save ? [...old, { _id: tuitionId } as Tuition] : old.filter((t) => t._id !== tuitionId)));
      return { prev };
    },
    onError: (e, _save, ctx) => { qc.setQueryData(["saved"], ctx?.prev); toast.error(e.message); },
    onSuccess: (_d, save) => { toast.success(save ? "Saved to your list" : "Removed from saved"); void qc.invalidateQueries({ queryKey: ["saved"] }); },
  });

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) { toast.info("Sign in as a student to save tuitions"); router.push("/sign-in"); return; }
    if (!isStudent) { toast.info("Only student accounts can save tuitions"); return; }
    toggle.mutate(!isSaved);
  };

  return (
    <button onClick={onClick} aria-pressed={isSaved} aria-label={isSaved ? "Remove from saved tuitions" : "Save tuition"} className={cn("grid size-9 cursor-pointer place-items-center rounded-full bg-card/90 shadow-sm backdrop-blur transition-all hover:scale-110 active:scale-95", className)}>
      <Bookmark className={cn("size-[18px] transition-colors", isSaved ? "fill-accent text-accent" : "text-ink")} />
    </button>
  );
}
