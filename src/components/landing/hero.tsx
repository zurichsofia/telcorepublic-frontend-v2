"use client";

import { motion, useReducedMotion } from "motion/react";

import { HeroGlassNav } from "./hero-glass-nav";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="px-3 pb-10 pt-3 sm:px-5 sm:pb-14 sm:pt-5"
    >
      <div className="relative mx-auto w-full max-w-[min(100%,1400px)] border-0 shadow-none ring-0 outline-none">
        <div className="relative min-h-[90svh] w-full">
          <HeroGlassNav />

          <div className="relative z-10 flex min-h-[100vh] flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:px-12 sm:pb-20 sm:pt-32 lg:px-16">
            <div className="max-w-5xl">
              <h1 className="font-display text-[clamp(2.75rem,8vw,4.875rem)] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--color-heading)] [text-shadow:0_2px_30px_rgba(0,0,0,0.6),0_0_80px_rgba(0,0,0,0.4)]">
                <motion.span
                  className="block"
                  initial={reduce ? undefined : { opacity: 0, y: 32 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.95, ease, delay: 0.02 }}
                >
                  Navigating the Shift.
                </motion.span>
                <motion.span
                  className="mt-1 block sm:mt-2"
                  initial={reduce ? undefined : { opacity: 0, y: 32 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.95, ease, delay: 0.16 }}
                >
                  Leading the Techco Revolution.
                </motion.span>
              </h1>

              <motion.p
                className="mt-8 text-base font-light leading-[1.7] text-[var(--color-body)] sm:text-lg"
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease, delay: 0.32 }}
              >
                Fact-Based Research.
                <br />
                Actionable Disruption.
              </motion.p>

              <motion.div
                className="pointer-events-none mx-auto mt-14 h-px w-24 max-w-[40%] origin-center bg-gradient-to-r from-transparent via-[rgba(255,180,100,0.45)] to-transparent sm:mt-16"
                initial={reduce ? undefined : { opacity: 0, scaleX: 0.2 }}
                animate={reduce ? undefined : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.1, ease, delay: 0.45 }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
