import { cn } from "@/lib/utils";

const tones = {
  violet: "text-primary",
  pink: "text-accent-text",
  sky: "text-sky",
  amber: "text-amber",
  mint: "text-mint",
  gradient: "text-gradient",
} as const;

/** Colours a word or phrase inside a heading so headings are multi-coloured instead of one flat colour. */
export function Hl({ tone = "violet", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={cn(tones[tone])}>{children}</span>;
}
