"use client";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL = "__all";
export interface Option { value: string; label: string }

/** Styled dropdown (Radix Select). An empty string value means "no filter". */
export function FilterSelect({ label, value, onChange, options, className }: { label: string; value: string; onChange: (v: string) => void; options: Option[]; className?: string }) {
  return (
    <RadixSelect.Root value={value || ALL} onValueChange={(v) => onChange(v === ALL ? "" : v)}>
      <RadixSelect.Trigger aria-label={label} className={cn("group flex h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 text-left text-sm font-medium transition-colors hover:border-primary/50 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25 data-[state=open]:border-primary", className)}>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
          <span className="truncate"><RadixSelect.Value /></span>
        </span>
        <RadixSelect.Icon><ChevronDown className="size-4 text-muted transition-transform group-data-[state=open]:rotate-180" aria-hidden /></RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content position="popper" sideOffset={8} className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-2xl shadow-primary/10 data-[state=open]:animate-[fade_0.15s_ease-out]">
          <RadixSelect.Viewport>
            {options.map((o) => (
              <RadixSelect.Item key={o.value || ALL} value={o.value || ALL} className="relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg py-2.5 pl-3 pr-3 text-sm outline-none data-[highlighted]:bg-violet-soft data-[highlighted]:text-primary data-[state=checked]:font-semibold">
                <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator><Check className="size-4 text-primary" aria-hidden /></RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
