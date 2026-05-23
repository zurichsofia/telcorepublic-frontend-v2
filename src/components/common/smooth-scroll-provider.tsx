"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

type SmoothScrollProviderProps = {
  children: ReactNode;
  /** Disable Lenis on routes that do not need cinematic scroll (e.g. contact forms). */
  enabled?: boolean;
};

/**
 * Lenis smooth scroll — matches the feel of mont-fort.com and other Awwwards 3D landings.
 * Hero progress is read from layout on each Lenis scroll frame (see `readHeroScrollProgress`).
 */
export function SmoothScrollProvider({
  children,
  enabled = true,
}: SmoothScrollProviderProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduceMotion || !enabled) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.35,
      autoRaf: false,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");
    setLenis(instance);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      setLenis(null);
    };
  }, [reduceMotion, enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
