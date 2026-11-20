import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";

const sections = [
  { title: "Platform", links: [["Browse Tuitions", "/tuitions"], ["Pricing", "/pricing"], ["How It Works", "/how-it-works"], ["About", "/about"]] },
  { title: "For you", links: [["Find a tutor", "/tuitions"], ["Become a tutor", "/sign-up"], ["Sign in", "/sign-in"]] },
];

const Svg = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" role="img" aria-label={label}>{children}</svg>
);
const socials = [
  { label: "X (formerly Twitter)", href: "https://x.com", icon: <Svg label="X"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></Svg> },
  { label: "Facebook", href: "https://facebook.com", icon: <Svg label="Facebook"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" /></Svg> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <Svg label="LinkedIn"><path d="M4 9h4v11H4zM6 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6c.6-1 1.9-1.9 3.8-1.9 3.4 0 4.2 2.2 4.2 5.1V20h-4v-5.4c0-1.3-.1-2.9-1.9-2.9s-2.1 1.4-2.1 2.8V20h-4z" /></Svg> },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-footer text-indigo-100">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo className="text-white" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-indigo-200/80">{SITE.tagline} MentorLagbe connects students and guardians with tutors for online and home tuition across Bangladesh.</p>
          <div className="mt-6 flex gap-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-accent hover:bg-accent hover:text-white">{s.icon}</a>
            ))}
          </div>
        </div>
        {sections.map((s) => (
          <div key={s.title}>
            <h3 className="text-sm font-semibold text-white">{s.title}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {s.links.map(([label, href]) => (
                <li key={href + label}><Link href={href!} className="text-indigo-200/80 transition-colors hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-indigo-200/80">
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /> {SITE.location}</li>
            <li className="flex items-center gap-3"><Phone className="size-4 shrink-0" aria-hidden /> {SITE.phone}</li>
            <li className="flex items-center gap-3"><Mail className="size-4 shrink-0" aria-hidden /> {SITE.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} MentorLagbe. All rights reserved.</div>
    </footer>
  );
}
