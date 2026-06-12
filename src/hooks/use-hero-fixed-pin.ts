"use client";

import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  setSharedHeroPinMetrics,
  type HeroPinMetrics,
} from "@/lib/snow-mountain/hero-pin-metrics";

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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const viewportPx = window.innerHeight;
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

    const refreshMetrics = () => {
      const viewportPx = window.innerHeight;
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

    let resizeTimer = 0;
    const onLayoutChange = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        refreshMetrics();
        syncPhase();
      }, 200);
    };

    const onScroll = () => {
      syncPhase();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("orientationchange", onLayoutChange);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("orientationchange", onLayoutChange);
      setSharedHeroPinMetrics(null);
    };
  }, [sectionRef]);

  return { phase, metricsRef };
}
