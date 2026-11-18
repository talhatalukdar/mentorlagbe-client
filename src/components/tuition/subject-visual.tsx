import { Atom, BookOpen, Calculator, Code2, Dna, FlaskConical, Landmark, Languages, Laptop, TrendingUp } from "lucide-react";

const map: Record<string, { Icon: typeof Atom; from: string; to: string }> = {
  Mathematics: { Icon: Calculator, from: "#c7d2fe", to: "#e0e7ff" },
  Physics: { Icon: Atom, from: "#bfdbfe", to: "#dbeafe" },
  Chemistry: { Icon: FlaskConical, from: "#fbcfe8", to: "#fce7f3" },
  Biology: { Icon: Dna, from: "#bbf7d0", to: "#dcfce7" },
  English: { Icon: Languages, from: "#fde68a", to: "#fef3c7" },
  ICT: { Icon: Laptop, from: "#c7d2fe", to: "#ddd6fe" },
  Programming: { Icon: Code2, from: "#a5b4fc", to: "#c7d2fe" },
  Accounting: { Icon: Landmark, from: "#fed7aa", to: "#ffedd5" },
  Economics: { Icon: TrendingUp, from: "#fecdd3", to: "#ffe4e6" },
};

export const subjectIcon = (s: string) => (map[s] ?? { Icon: BookOpen }).Icon;

/** Used when a tuition has no uploaded banner. Honest, deterministic placeholder (not a fake photo). */
export function SubjectVisual({ subject, className = "" }: { subject: string; className?: string }) {
  const m = map[subject] ?? { Icon: BookOpen, from: "#e0e7ff", to: "#f1f5f9" };
  return (
    <div className={`relative grid place-items-center overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${m.from}, ${m.to})` }} aria-hidden>
      <div className="absolute -right-6 -top-6 size-28 rounded-full bg-white/40 blur-xl" />
      <m.Icon className="size-14 text-[#1e2433]/80" strokeWidth={1.4} />
    </div>
  );
}
