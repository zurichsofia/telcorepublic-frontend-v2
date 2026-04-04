"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type ScrollRevealFrom = "left" | "right" | "up" | "down";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Entrance direction */
  from?: ScrollRevealFrom;
  delayMs?: number;
  /** Subtle blur-in (heavier; use sparingly) */
  blur?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

function offsetFor(from: ScrollRevealFrom) {
  switch (from) {
    case "right":
      return { x: 36, y: 0 };
    case "up":
      return { x: 0, y: 36 };
    case "down":
      return { x: 0, y: -28 };
    case "left":
    default:
      return { x: -36, y: 0 };
  }
}

export function ScrollReveal({
  children,
  className = "",
  from = "left",
  delayMs = 0,
  blur = false,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const { x, y } = offsetFor(from);

  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? undefined
          : {
              opacity: 0,
              x,
              y,
              filter: blur ? "blur(12px)" : "blur(0px)",
            }
      }
      whileInView={
        reduce
          ? undefined
          : {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
            }
      }
      viewport={{ once: true, amount: 0.14, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: 0.75,
        delay: delayMs / 1000,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}
