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

  /** After exit commit, skip until user scrolls clearly back up from the Why intro. */
  const homeExitSnapConsumedRef = useRef(false);
  const ignoreCommitUntilRef = useRef(0);
  /** Last scroll position after a settled gesture (`scrollend`) — for fast-skip recovery. */
  const scrollYAtLastScrollEndRef = useRef(0);

  useEffect(() => {
    if (reduce) return;

    scrollYAtLastScrollEndRef.current = window.scrollY;

    let debounceId: number | undefined;
    const DEBOUNCE_MS = 120;

    const tryCommitAfterIdle = () => {
      if (performance.now() < ignoreCommitUntilRef.current) return;

      const idealY = homeWhySnapScrollTop();
      if (idealY == null) return;

      const y = window.scrollY;
      const vh = window.innerHeight;

      // Snap only fires in the hero's exit zone — after the parallax animation
      // completes (HERO_STICKY_SCROLL_VH) up to the section end (HERO_SECTION_VH).
      const exitZonePx = ((HERO_SECTION_VH - HERO_STICKY_SCROLL_VH) / 100) * vh;
      const seamLow = idealY - exitZonePx;
      const seamHigh = idealY + Math.min(vh * 0.6, 640);

      // Re-arm once the user scrolls clearly above the snap zone.
      if (y < seamLow) {
        homeExitSnapConsumedRef.current = false;
      }
      if (homeExitSnapConsumedRef.current) return;

      // Looser than 1px so we do not fight native scroll-snap + subpixel layout.
      if (Math.abs(y - idealY) <= 8) return;

      if (y < seamLow || y > seamHigh) return;

      homeExitSnapConsumedRef.current = true;
      ignoreCommitUntilRef.current = performance.now() + 900;
      window.scrollTo({ top: idealY, left: 0, behavior: "smooth" });
    };

    const onScroll = () => {
      // Ignore scroll events produced by the smooth snap animation itself.
      if (performance.now() < ignoreCommitUntilRef.current) return;
      if (debounceId !== undefined) window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => {
        debounceId = undefined;
        tryCommitAfterIdle();
      }, DEBOUNCE_MS);
    };

    const onScrollEnd = () => {
      if (debounceId !== undefined) {
        window.clearTimeout(debounceId);
        debounceId = undefined;
      }
      const prevSettledY = scrollYAtLastScrollEndRef.current;
      tryCommitAfterIdle();

      if (performance.now() < ignoreCommitUntilRef.current) {
        scrollYAtLastScrollEndRef.current = window.scrollY;
        return;
      }

      const idealY = homeWhySnapScrollTop();
      if (idealY != null) {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const dy = y - prevSettledY;
        // One gesture jumped from the hero / Why top into the middle of the first
        // Why viewport (CSS snap + `scroll-snap-stop` can still miss on some inputs).
        if (
          prevSettledY < idealY + vh * 0.06 &&
          y > idealY + vh * 0.14 &&
          y < idealY + vh * 0.88 &&
          dy > vh * 0.32
        ) {
          ignoreCommitUntilRef.current = performance.now() + 900;
          window.scrollTo({ top: idealY, left: 0, behavior: "smooth" });
        }
      }

      scrollYAtLastScrollEndRef.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      if (debounceId !== undefined) window.clearTimeout(debounceId);
    };
  }, [reduce]);

  useLayoutEffect(() => {
    if (reduce) {
      homeExitSnapConsumedRef.current = false;
      ignoreCommitUntilRef.current = 0;
    }
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
