"use client";

import AnimatedContent from "@/components/AnimatedContent";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { ReactNode } from "react";

export type ScrollRevealFrom = "left" | "right" | "up" | "down";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Entrance direction */
  from?: ScrollRevealFrom;
  delayMs?: number;
  /** Slightly softer entrance (no CSS filter - avoids expensive blur compositing while scrolling). */
  blur?: boolean;
};

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
  const reduce = usePrefersReducedMotion();
  const { x, y } = offsetFor(from);
  const extraY = blur ? 10 : 0;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatedContent
      className={className}
      translateFrom={{ x, y: y + extraY }}
      animateOpacity={false}
      duration={0.75}
      delay={delayMs / 1000}
      ease="power3.out"
      start="top 92%"
    >
      {children}
    </AnimatedContent>
  );
}
