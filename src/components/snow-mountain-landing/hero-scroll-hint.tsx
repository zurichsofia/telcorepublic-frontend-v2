"use client";

import { motion, type MotionValue } from "motion/react";

type HeroScrollHintProps = {
  scrollOpacity?: MotionValue<number>;
};

export function HeroScrollHint({ scrollOpacity }: HeroScrollHintProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[24] flex justify-center">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-end pb-10 sm:pb-14">
        <motion.div
          className="flex flex-col items-center"
          style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
        >
          <a
            // href="#signal"
            className="pointer-events-auto flex items-center gap-3 rounded-full text-xs font-medium uppercase tracking-widest text-white animate-pulse duration-900"
            aria-label="Scroll to Signal intelligence"
          >
            <span
              className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(200,210,224,0.45)]"
              aria-hidden
            />
            <span>Scroll</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
