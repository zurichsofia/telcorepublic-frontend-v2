"use client";

import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { isMobileDevice } from "@/lib/device/is-coarse-pointer";
import {
  setSharedHeroPinMetrics,
  type HeroPinMetrics,
} from "@/lib/snow-mountain/hero-pin-metrics";
import { getStableViewportPx } from "@/lib/viewport-css-vars";

export type HeroPinPhase = "before" | "pinned" | "after";

export type { HeroPinMetrics };

export { readHeroPinProgress, getHeroBottomFromPinMetrics } from "@/lib/snow-mountain/hero-pin-metrics";

function getScrollY(): number {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

/**
 * Fixed-position hero pin — avoids iOS `position: sticky` + WebGL compositor jitter.
 */
export function useHeroFixedPin(sectionRef: RefObject<HTMLElement | null>) {
  const [phase, setPhase] = useState<HeroPinPhase>("before");
  const metricsRef = useRef<HeroPinMetrics>({
    pinStartY: 0,
    pinPx: 1,
    sectionHeight: 0,
    viewportPx: 0,
  });
  const phaseRef = useRef<HeroPinPhase>("before");
  const lockedViewportRef = useRef<number | null>(null);

  const readViewportPx = (force = false) => {
    if (!isMobileDevice()) return window.innerHeight;
    if (force) lockedViewportRef.current = null;
    if (lockedViewportRef.current === null) {
      lockedViewportRef.current = getStableViewportPx();
    }
    return lockedViewportRef.current;
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const viewportPx = readViewportPx();
    const sectionHeight = section.offsetHeight;
    const pinPx = Math.max(1, sectionHeight - viewportPx);
    const rect = section.getBoundingClientRect();
    metricsRef.current = {
      pinStartY: getScrollY() + rect.top,
      pinPx,
      sectionHeight,
      viewportPx,
    };
    setSharedHeroPinMetrics(metricsRef.current);
  }, [sectionRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const refreshMetrics = (forceViewport = false) => {
      const viewportPx = readViewportPx(forceViewport);
      const sectionHeight = section.offsetHeight;
      const pinPx = Math.max(1, sectionHeight - viewportPx);
      const rect = section.getBoundingClientRect();
      const pinStartY =
        phaseRef.current === "pinned"
          ? metricsRef.current.pinStartY
          : getScrollY() + rect.top;

      metricsRef.current = {
        pinStartY,
        pinPx,
        sectionHeight,
        viewportPx,
      };
      setSharedHeroPinMetrics(metricsRef.current);
    };

    const syncPhase = () => {
      const { pinStartY, pinPx } = metricsRef.current;
      const scrollY = getScrollY();
      let next: HeroPinPhase = "before";

      if (scrollY >= pinStartY + pinPx) next = "after";
      else if (scrollY >= pinStartY) next = "pinned";

      phaseRef.current = next;
      setPhase((prev) => (prev === next ? prev : next));
    };

    refreshMetrics();
    syncPhase();

    const mobile = isMobileDevice();
    let resizeTimer = 0;
    const onLayoutChange = (forceViewport = false) => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        refreshMetrics(forceViewport);
        syncPhase();
      }, 200);
    };
    const onResize = () => onLayoutChange();
    const onOrientationChange = () => onLayoutChange(true);

    const onScroll = () => {
      syncPhase();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Mobile URL-bar show/hide fires resize — ignore it so beat pacing stays linear.
    if (!mobile) {
      window.addEventListener("resize", onResize);
    }
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      if (!mobile) {
        window.removeEventListener("resize", onResize);
      }
      window.removeEventListener("orientationchange", onOrientationChange);
      setSharedHeroPinMetrics(null);
    };
  }, [sectionRef]);

  return { phase, metricsRef };
}
