import { BadgeCheck, MonitorSmartphone } from "lucide-react";
import { SubjectImage } from "@/components/tuition/subject-image";

const frames = [
  { subject: "Chemistry", alt: "Students doing a chemistry experiment", tint: "bg-sky-soft", ratio: "aspect-[3/4.6]" },
  { subject: "English", alt: "A tutor guiding a student through notes", tint: "bg-accent-soft", ratio: "aspect-[3/5.4]" },
  { subject: "Mathematics", alt: "A teacher helping a student with a maths lesson", tint: "bg-mint-soft", ratio: "aspect-[3/4.2]" },
];

/** Three arch-shaped photo frames (staggered heights) — the hero visual. Photos fall back to colour washes if they fail. */
export function HeroArches() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="grid grid-cols-3 items-end gap-3 sm:gap-5">
        {frames.map((f) => (
          <div key={f.subject} className={`rounded-t-full rounded-b-3xl p-2 ${f.tint}`}>
            <div className={`relative overflow-hidden rounded-t-full rounded-b-2xl ${f.ratio}`}>
              <SubjectImage subject={f.subject} alt={f.alt} sizes="(min-width:1024px) 14vw, 30vw" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute -bottom-4 left-0 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur sm:-left-4">
        <BadgeCheck className="size-5 text-mint" aria-hidden /> Admin-reviewed listings
      </div>
      <div className="absolute -top-3 right-0 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur sm:-right-3">
        <MonitorSmartphone className="size-5 text-primary" aria-hidden /> Online &amp; offline classes
      </div>
    </div>
  );
}
