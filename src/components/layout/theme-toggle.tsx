"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const Current = mounted && resolvedTheme === "dark" ? Moon : Sun;
  return (
    <Dropdown.Root>
      <Dropdown.Trigger aria-label="Change theme" className="grid size-10 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-surface">
        <Current className="size-[18px]" />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={8} className="z-50 min-w-36 rounded-xl border border-border bg-card p-1.5 shadow-xl data-[state=open]:animate-in data-[state=open]:fade-in">
          {options.map(({ value, label, Icon }) => (
            <Dropdown.Item key={value} onSelect={() => setTheme(value)} className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface ${mounted && theme === value ? "font-semibold text-accent-text" : ""}`}>
              <Icon className="size-4" /> {label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
