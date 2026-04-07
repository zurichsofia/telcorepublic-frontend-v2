"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { BrandLogoSignal } from "@/components/brand-logo-signal";

const ease = [0.22, 1, 0.36, 1] as const;

/** Minimum time the loader stays visible so it does not feel like a glitch. */
const MIN_MS = 720;
/** Safety cap if load/fonts hang. */
const MAX_MS = 14000;

export function PageLoader() {
  const [phase, setPhase] = useState<"loading" | "exit" | "gone">("loading");
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const scheduleExit = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setPhase("exit");
      }, wait);
    };

    const waitForReady = async () => {
      try {
        await Promise.all([
          document.fonts.ready,
          new Promise<void>((resolve) => {
            if (document.readyState === "complete") resolve();
            else window.addEventListener("load", () => resolve(), { once: true });
          }),
        ]);
      } catch {
        /* ignore */
      }
      scheduleExit();
    };

    void waitForReady();

    const maxTimer = window.setTimeout(() => {
      if (!cancelled) setPhase((p) => (p === "loading" ? "exit" : p));
    }, MAX_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "gone") return null;

  const exitDuration = reduce ? 0.2 : 0.75;

  return (
    <motion.div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: "#b6bfc7",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: exitDuration, ease }}
      onAnimationComplete={() => {
        if (phase === "exit") setPhase("gone");
      }}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label="Loading"
    >
      <div className="flex flex-col items-center text-center">
        <BrandLogoSignal priority />

        <div className="relative mt-10 h-[2px] w-[min(12rem,70vw)] overflow-hidden rounded-full">
          {!reduce && (
            <motion.span
              className="absolute inset-y-0 w-1/3 rounded-full"
              animate={{ left: ["-33%", "100%"] }}
              transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
            />
          )}
          {reduce && (
            <span
              className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(58,52,68,0.42)] to-transparent opacity-80"
              aria-hidden
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
