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
import { resetLenisScrollY, setLenisScrollY } from "@/lib/lenis-scroll";

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
      resetLenisScrollY();
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      autoRaf: false,
    });

    const syncScrollY = () => {
      setLenisScrollY(instance.scroll);
    };

    document.documentElement.classList.add("lenis", "lenis-smooth");
    setLenis(instance);
    syncScrollY();
    const offScroll = instance.on("scroll", syncScrollY);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      offScroll();
      cancelAnimationFrame(rafId);
      instance.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      resetLenisScrollY();
      setLenis(null);
    };
  }, [reduceMotion, enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
