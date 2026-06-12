"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { isMobileDevice } from "@/lib/device/is-coarse-pointer";
import { resetLenisScrollY, setLenisScrollY } from "@/lib/lenis-scroll";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

type SmoothScrollProviderProps = {
  children: ReactNode;
  /** Opt out of Lenis (e.g. Sanity Studio). Defaults to on for the whole site. */
  enabled?: boolean;
};

/** Site-wide scroll smoothing — lower = slower/butterier. */
export const LENIS_LERP = 0.05;

const LENIS_BASE_OPTIONS = {
  lerp: LENIS_LERP,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1.4,
  autoRaf: false,
} as const satisfies ConstructorParameters<typeof Lenis>[0];

/** Site-wide Lenis smooth scroll (respects prefers-reduced-motion). */
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

    // Lenis + position:sticky jitter on iOS — native scroll on mobile only.
    if (typeof window !== "undefined" && isMobileDevice()) {
      resetLenisScrollY();
      setLenis(null);
      return;
    }

    const instance = new Lenis(LENIS_BASE_OPTIONS);

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
export function LenisScrollToTopOnNavigate({ pathname }: { pathname: string; }) {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useLayoutEffect(() => {
    resetScrollPosition(lenisRef.current);
  }, [pathname]);

  useEffect(() => {
    if (!lenis) return;
    resetScrollPosition(lenis);
  }, [lenis]);

  return null;
}
