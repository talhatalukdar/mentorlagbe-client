"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage, validateImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

/** Direct file upload (no URL pasting). Validates type/size, shows progress, returns the hosted URL. */
export function ImageUpload({ value, onChange, label, shape = "wide", disabled }: { value?: string; onChange: (url: string) => void; label: string; shape?: "wide" | "round"; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function onFile(file?: File) {
    if (!file) return;
    const problem = validateImage(file);
    if (problem) return void toast.error(problem);
    setProgress(0);
    try {
      onChange(await uploadImage(file, setProgress));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <button type="button" disabled={disabled || progress !== null} onClick={() => input.current?.click()} aria-label={label}
        className={cn("group relative grid cursor-pointer place-items-center overflow-hidden border-2 border-dashed border-border bg-surface/60 transition-colors hover:border-accent disabled:cursor-not-allowed", shape === "round" ? "size-28 rounded-full" : "aspect-[16/9] w-full rounded-2xl")}>
        {value ? <Image src={value} alt="Uploaded preview" fill sizes="400px" className="object-cover" /> : <span className="flex flex-col items-center gap-1 text-sm text-muted"><ImagePlus className="size-6" aria-hidden />{label}</span>}
        {value && <span className="absolute inset-0 grid place-items-center bg-black/45 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">Replace image</span>}
        {progress !== null && <span className="absolute inset-0 grid place-items-center bg-black/55 text-white"><span className="flex flex-col items-center gap-2 text-sm"><Loader2 className="size-5 animate-spin" />Uploading {progress}%</span></span>}
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => void onFile(e.target.files?.[0])} />
      {shape === "wide" && <p className="mt-1.5 text-xs text-muted">JPG, PNG or WebP, up to 5MB.</p>}
    </div>
  );
}
