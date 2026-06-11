"use client";

import { useEffect, useState } from "react";

import { BrandLogoSignal } from "@/components/common/brand-logo-signal";
import { useLenis } from "@/components/common/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const EXIT_MS = 500;
const REVEAL_DELAY_MS = 280;
const MAX_MS = 10000;

type HeroSceneLoaderProps = {
  ready: boolean;
};

export function HeroSceneLoader({ ready }: HeroSceneLoaderProps) {
  const reduce = usePrefersReducedMotion();
  const lenis = useLenis();
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => setPhase("exiting"), MAX_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!ready || phase !== "loading") return;
    const delay = reduce ? 0 : REVEAL_DELAY_MS;
    const timer = window.setTimeout(() => setPhase("exiting"), delay);
    return () => window.clearTimeout(timer);
  }, [ready, phase, reduce]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const duration = reduce ? 120 : EXIT_MS;
    const timer = window.setTimeout(() => setPhase("done"), duration);
    return () => window.clearTimeout(timer);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase === "done") {
      lenis?.start();
    } else {
      lenis?.stop();
    }
  }, [phase, lenis]);

  useEffect(() => {
    return () => lenis?.start();
  }, [lenis]);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-telco-dark transition-opacity ease-out",
        phase === "exiting" ? "opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: reduce ? "120ms" : `${EXIT_MS}ms` }}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label="Loading"
    >
      <BrandLogoSignal priority size="compact" />
    </div>
  );
}
