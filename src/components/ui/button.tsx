import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-primary to-[#9a5cff] text-white hover:brightness-110",
        accent: "bg-gradient-to-r from-accent to-[#ff8a5c] text-white hover:brightness-105",
        outline: "border border-border bg-card text-ink hover:border-primary hover:text-primary",
        ghost: "text-ink hover:bg-violet-soft hover:text-primary",
        danger: "bg-danger-soft text-danger hover:brightness-95",
      },
      size: { sm: "h-9 px-4", md: "h-11 px-6", lg: "h-12 px-7 text-base", icon: "size-10" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { loading?: boolean };

export function Button({ className, variant, size, loading, children, disabled, ...props }: Props) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({ className, variant, size, ...props }: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return <Link className={cn(buttonVariants({ variant, size }), "group", className)} {...props} />;
}
