"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import { HOME_WHY_SNAP_ID } from "@/components/common/document-scroll-snap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
} from "@/lib/snow-mountain-hero-scroll";
import { HERO_SECTION_VH, HERO_STICKY_SCROLL_VH } from "./hero-scroll";
import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMotionScrollLayers } from "./hero-motion-scroll-layers";
import { HeroScrollHint } from "./hero-scroll-hint";
import { HeroStickyLayer } from "./hero-sticky-layer";

/** Scroll `y` so `#home-why-snap` top meets the document scrollport’s padded top. */
function homeWhySnapScrollTop(): number | null {
  const el = document.getElementById(HOME_WHY_SNAP_ID);
  if (!el) return null;
  // Skip scroll-padding-top: the hero sticky layer is visible until scroll =
  // section.offsetTop, so any pullback exposes the mountain behind the nav.
  // The Why section's pt-28 (112px) clears the fixed nav (72px) on its own.
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY);
}

export function SnowMountainHero() {
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const heroParallaxMotionRef = useRef<HeroParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [heroCursor, setHeroCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollHintOpacity = useTransform(scrollYProgress, [0.65, 0.88], [1, 0]);

  const syncParallax = useCallback(
    (latest: number) => {
      if (reduce) {
        heroParallaxMotionRef.current = { x: 0, y: 0, scale: 1 };
        return;
      }
      heroParallaxMotionRef.current = {
        x: heroPrimaryParallaxX(latest),
        y: heroPrimaryParallaxY(latest),
        scale: 1,
      };
    },
    [reduce],
  );

  useMotionValueEvent(scrollYProgress, "change", syncParallax);

  /**
   * Align `#home-why-snap` when leaving the snow hero tail:
   * - Down-scroll in the seam → one eased `scrollTo` (not instant).
   * - `scrollend` in the seam → same, for slow drags.
   * `smoothInFlight` + `ignoreUntil` avoid overlapping smooth scrolls.
   */
  useEffect(() => {
    if (reduce) return;
    let ignoreUntil = 0;
    let lastY = window.scrollY;
    let smoothInFlight = false;
    let clearFlightId: number | undefined;

    const metrics = () => {
      const idealY = homeWhySnapScrollTop();
      if (idealY == null) return null;
      const vh = window.innerHeight;
      const exitZonePx = ((HERO_SECTION_VH - HERO_STICKY_SCROLL_VH) / 100) * vh;
      return {
        idealY,
        seamLow: idealY - exitZonePx,
        seamHigh: idealY + 24,
        vh,
      };
    };

    const commitEase = (idealY: number) => {
      if (smoothInFlight) return;
      smoothInFlight = true;
      if (clearFlightId !== undefined) window.clearTimeout(clearFlightId);
      ignoreUntil = performance.now() + 520;
      window.scrollTo({ top: idealY, left: 0, behavior: "smooth" });
      lastY = idealY;
      clearFlightId = window.setTimeout(() => {
        smoothInFlight = false;
        clearFlightId = undefined;
      }, 620);
    };

    const onScroll = () => {
      if (performance.now() < ignoreUntil) {
        lastY = window.scrollY;
        return;
      }
      const m = metrics();
      if (!m) return;
      const { idealY, seamLow, vh } = m;
      const y = window.scrollY;

      if (Math.abs(y - idealY) <= 10) {
        lastY = y;
        return;
      }
      if (y > idealY + vh * 0.42) {
        lastY = y;
        return;
      }

      const scrollingDown = y > lastY + 1;
      if (!scrollingDown) {
        lastY = y;
        if (y < idealY - 80) smoothInFlight = false;
        return;
      }
      lastY = y;
      if (y >= seamLow && y < idealY - 8) {
        commitEase(idealY);
      }
    };

    const onScrollEnd = () => {
      if (performance.now() < ignoreUntil) {
        lastY = window.scrollY;
        return;
      }
      if (smoothInFlight) {
        lastY = window.scrollY;
        return;
      }
      const m = metrics();
      if (!m) return;
      const { idealY, seamLow, seamHigh, vh } = m;
      const y = window.scrollY;
      lastY = y;

      if (y > idealY + vh * 0.45) return;
      if (Math.abs(y - idealY) <= 10) return;
      if (y < seamLow || y > seamHigh) return;
      commitEase(idealY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      if (clearFlightId !== undefined) window.clearTimeout(clearFlightId);
    };
  }, [reduce]);

  useLayoutEffect(() => {
    syncParallax(reduce ? 0 : scrollYProgress.get());
  }, [reduce, scrollYProgress, syncParallax]);

  useEffect(() => {
    if (reduce) {
      setHeroCursor(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const el = heroCanvasRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        setHeroCursor(null);
        return;
      }
      setHeroCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-0 flex-col"
      style={{
        height: `${HERO_SECTION_VH}vh`,
        minHeight: `${HERO_SECTION_VH}vh`,
      }}
    >
      <HeroStickyLayer
        reduceMotion={!!reduce}
        heroCanvasRef={heroCanvasRef}
        heroSectionRef={heroRef}
        motionRef={heroParallaxMotionRef}
      >
        <HeroMotionScrollLayers
          scrollYProgress={scrollYProgress}
          reduceMotion={!!reduce}
        />
      </HeroStickyLayer>

      {!reduce && heroCursor != null ? (
        <HeroCursorGlow position={heroCursor} />
      ) : null}

      <HeroScrollHint scrollOpacity={reduce ? undefined : scrollHintOpacity} />

      {/* Fills remaining height between sticky (100vh) and section total. */}
      <div
        aria-hidden
        className="min-h-0 w-full shrink-0 grow basis-0"
      />
    </section>
  );
}
