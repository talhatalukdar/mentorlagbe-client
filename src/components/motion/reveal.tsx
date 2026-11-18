"use client";
import { motion, type HTMLMotionProps } from "motion/react";

/** Single, restrained scroll-reveal primitive (transform/opacity only, runs once, honours reduced motion via MotionConfig). */
export function Reveal({ delay = 0, y = 16, className, children, ...rest }: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
