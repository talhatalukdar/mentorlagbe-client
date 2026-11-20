/** Original line illustration: a tutor and a student working at a desk (stroke follows the theme ink colour). */
export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 420" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Illustration of a tutor helping a student at a desk">
      <rect x="70" y="40" width="70" height="90" rx="4" fill="#c9bdff" /><rect x="82" y="52" width="46" height="66" rx="2" fill="var(--card)" />
      <rect x="440" y="70" width="56" height="72" rx="4" fill="#ffd0dc" /><rect x="450" y="80" width="36" height="52" rx="2" fill="var(--card)" />
      <path d="M40 360h480" />
      <rect x="60" y="190" width="70" height="170" rx="4" /><path d="M60 240h70M60 290h70" /><rect x="72" y="205" width="46" height="26" rx="2" /><rect x="72" y="255" width="46" height="26" rx="2" />
      <path d="M150 360V300l-8-60" />
      <path d="M170 360h340" />
      {/* laptop */}
      <path d="M190 340l18-70h120l-12 70z" fill="#9fd6ff" /><circle cx="262" cy="305" r="5" /><path d="M170 346h190" />
      {/* student */}
      <circle cx="270" cy="170" r="30" fill="var(--card)" /><path d="M244 150c4-18 34-26 50-8" /><circle cx="262" cy="172" r="2" fill="currentColor" /><circle cx="282" cy="172" r="2" fill="currentColor" /><path d="M264 184q8 6 16 0" />
      <path d="M232 262c0-34 18-58 38-58s40 24 40 58" fill="#ff8fb1" />
      {/* tutor */}
      <circle cx="400" cy="130" r="32" fill="var(--card)" /><path d="M370 126c4-26 54-30 62 0v22c-6 22-52 22-62 0z" fill="currentColor" opacity=".9" /><circle cx="392" cy="134" r="2" fill="var(--card)" /><circle cx="414" cy="134" r="2" fill="var(--card)" />
      <path d="M358 330c-6-70 10-150 42-166s52 20 52 70v96" fill="#8f7bff" />
      <path d="M370 215l-80 44" /><path d="M290 259l-18 6" />
      <path d="M392 168v90M410 168v90" opacity=".4" />
      {/* notebook + book */}
      <path d="M300 346l36-10 40 4-34 14z" fill="var(--card)" /><rect x="392" y="330" width="62" height="22" rx="3" fill="#ffb020" transform="rotate(-8 392 330)" />
      {/* plant */}
      <path stroke="#0fb5a5" d="M498 360c-4-40 6-70 6-70M504 300c-20-6-26-24-26-24M504 320c18-4 28-22 28-22M502 340c-16-2-24-18-24-18" />
    </svg>
  );
}
