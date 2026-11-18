import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { HeroIllustration } from "@/components/home/hero-illustration";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between"><Logo /><ThemeToggle /></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden items-center justify-center overflow-hidden bg-surface lg:flex">
        <div className="glow absolute inset-0" aria-hidden />
        <HeroIllustration className="relative w-full max-w-lg text-ink" />
      </div>
    </div>
  );
}
