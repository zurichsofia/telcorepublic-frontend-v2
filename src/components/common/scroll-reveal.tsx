"use client";

import { motion, useMotionValue, type MotionValue } from "motion/react";
import {
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import { isLenisActive, subscribeLenisScroll } from "@/lib/lenis-scroll";

function smoothstep01(t: number): number {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
}

export type ScrollLinkedRevealOptions = {
  /** Element center reaches full opacity at this viewport fraction (default ~center). */
  completeAtVh?: number;
  /** Reveal begins when element center is at or below this viewport fraction. */
  startAtVh?: number;
  /** Delays the ramp as a 0–1 fraction (positive = later). */
  lead?: number;
};

export function getScrollLinkedRevealProgress(
  rect: DOMRect,
  vh: number,
  {
    completeAtVh = 0.5,
    startAtVh = 0.94,
    lead = 0,
  }: ScrollLinkedRevealOptions = {},
): number {
  const center = rect.top + rect.height / 2;
  const completeAt = vh * completeAtVh;
  const startAt = vh * startAtVh;
  const span = Math.max(startAt - completeAt, 1);
  const raw = (startAt - center) / span - lead;
  return smoothstep01(raw);
}

type ScrollLinkedRevealProps = ScrollLinkedRevealOptions & {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  driftPx?: number;
  id?: string;
  "aria-labelledby"?: string;
};

/** Continuous scroll-linked fade/slide — pairs with Lenis and parallax backdrops. */
export function ScrollLinkedReveal({
  children,
  className,
  disabled = false,
  completeAtVh = 0.48,
  startAtVh = 0.94,
  lead = 0,
  driftPx = 44,
  id,
  "aria-labelledby": ariaLabelledBy,
}: ScrollLinkedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(disabled ? 1 : 0);
  const y = useMotionValue(disabled ? 0 : driftPx);

  useLayoutEffect(() => {
    if (disabled) {
      opacity.set(1);
      y.set(0);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const sync = () => {
      const rect = node.getBoundingClientRect();
      const progress = getScrollLinkedRevealProgress(rect, window.innerHeight, {
        completeAtVh,
        startAtVh,
        lead,
      });
      opacity.set(progress);
      y.set((1 - progress) * driftPx);
    };

    sync();

    const offScroll = subscribeLenisScroll(sync);
    if (!isLenisActive()) {
      window.addEventListener("scroll", sync, { passive: true });
    }
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      offScroll();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [completeAtVh, disabled, driftPx, lead, opacity, startAtVh, y]);

  return (
    <motion.div
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={className}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  );
}
