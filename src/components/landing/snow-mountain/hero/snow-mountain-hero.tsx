"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { createHeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  readHeroScrollProgress,
} from "@/lib/snow-mountain/snow-mountain-hero-scroll";

import { HERO_SECTION_VH } from "./snow-mountain-hero-scroll";
import { SnowMountainHeroMotionScrollLayers } from "./snow-mountain-hero-motion-scroll-layers";
import { SnowMountainHeroStickyLayer } from "./snow-mountain-hero-sticky-layer";

export function SnowMountainHero() {
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const scrollState = useRef(createHeroScrollState(0)).current;
  const heroParallaxMotionRef = useRef<SnowMountainParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
    scroll: 0,
  });

  const syncProgress = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || reduce) return;

    const progress = readHeroScrollProgress(hero);
    scrollState.set(progress);
    heroParallaxMotionRef.current = {
      x: heroPrimaryParallaxX(progress),
      y: heroPrimaryParallaxY(progress),
      scale: 1,
      scroll: progress,
    };
  }, [reduce, scrollState]);

  useLayoutEffect(() => {
    if (reduce) {
      scrollState.set(0);
      heroParallaxMotionRef.current = { x: 0, y: 0, scale: 1, scroll: 0 };
      return;
    }
    syncProgress();
  }, [reduce, scrollState, syncProgress]);

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
      <SnowMountainHeroStickyLayer
        reduceMotion={!!reduce}
        heroSectionRef={heroRef}
        heroCanvasRef={heroCanvasRef}
        scrollState={scrollState}
        motionRef={heroParallaxMotionRef}
      >
        <SnowMountainHeroMotionScrollLayers
          scrollState={scrollState}
          reduceMotion={!!reduce}
        />
      </SnowMountainHeroStickyLayer>

      <div aria-hidden className="min-h-0 w-full shrink-0 grow basis-0" />
    </section>
  );
}
