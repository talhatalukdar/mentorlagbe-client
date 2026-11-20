"use client";
import { motion, type HTMLMotionProps } from "motion/react";

/** Gentle fade-in when a section first enters the viewport. No movement, plays once, honours reduced motion. */
export function Reveal({ delay = 0, className, children, ...rest }: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const { y: _y, ...props } = rest as { y?: number };
  void _y;
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, delay }} className={className} {...(props as HTMLMotionProps<"div">)}>
      {children}
    </motion.div>
  );
}
