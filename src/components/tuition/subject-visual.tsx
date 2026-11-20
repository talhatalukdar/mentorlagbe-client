
const tint: Record<string, [string, string]> = {
  Mathematics: ["#b9b4ff", "#e1ddff"],
  Physics: ["#a8d6ff", "#d9eeff"],
  Chemistry: ["#ffb3cd", "#ffe0ec"],
  Biology: ["#a6ecd2", "#d9f7ec"],
  English: ["#ffe08a", "#fff3c9"],
  ICT: ["#b8c4ff", "#dde3ff"],
  Programming: ["#c3a8ff", "#e6dcff"],
  Accounting: ["#ffc9a0", "#ffe9d6"],
  Economics: ["#ffb8b8", "#ffe1e1"],
};

/** Fallback shown only when a subject photo is missing or fails to load: a soft colour wash with the subject name (no icons). */
export function SubjectVisual({ subject, className = "" }: { subject: string; className?: string }) {
  const [from, to] = tint[subject] ?? ["#d7d0ff", "#f0ecff"];
  return (
    <div className={`relative grid place-items-center overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} aria-hidden>
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/40 blur-2xl" />
      <span className="px-4 text-center font-serif text-4xl leading-none text-[#1d1a45]/35 sm:text-5xl">{subject}</span>
    </div>
  );
}

