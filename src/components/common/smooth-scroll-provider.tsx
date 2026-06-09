"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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
  /** Opt out of Lenis (e.g. isolated previews). Defaults to on for the whole site. */
  enabled?: boolean;
  /** Scroll easing — lower = smoother/slower. Default tuned for scroll-linked hero motion. */
  lerp?: number;
};

const DEFAULT_LERP = 0.06;

/** Site-wide Lenis smooth scroll (respects prefers-reduced-motion). */
export function SmoothScrollProvider({
  children,
  enabled = true,
  lerp = DEFAULT_LERP,
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
      lerp,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.78,
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
  }, [reduceMotion, enabled, lerp]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

function scrollViewToTopNative() {
  (document.scrollingElement ?? document.documentElement).scrollTo(0, 0);
  window.scrollTo(0, 0);
}

/** Keep Lenis and native scroll in sync — never call `window.scrollTo` alone when Lenis is active. */
export function resetScrollPosition(lenis: Lenis | null) {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
    return;
  }
  scrollViewToTopNative();
}

/** Resets scroll on client navigations — uses Lenis when active. */
export function LenisScrollToTopOnNavigate({ pathname }: { pathname: string }) {
  const lenis = useLenis();

  useLayoutEffect(() => {
    resetScrollPosition(lenis);
  }, [pathname, lenis]);

  useEffect(() => {
    resetScrollPosition(lenis);
    if (lenis) return;
    const t = setTimeout(scrollViewToTopNative, 0);
    return () => clearTimeout(t);
  }, [pathname, lenis]);

  return null;
}
