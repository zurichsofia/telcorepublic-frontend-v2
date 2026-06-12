"use client";

import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { createHeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";

import { HERO_SECTION_VH } from "./snow-mountain-hero-scroll";
import { SnowMountainHeroMotionScrollLayers } from "./snow-mountain-hero-motion-scroll-layers";
import { SnowMountainHeroStickyLayer } from "./snow-mountain-hero-sticky-layer";

/** Desktop hero — sticky pin, Lenis scroll, full Stage scene. */
export function SnowMountainHeroDesktop() {
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const scrollState = useRef(createHeroScrollState(0)).current;
  const motionRef = useRef<SnowMountainParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
    scroll: 0,
  });

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
        stickyRef={stickyRef}
        scrollState={scrollState}
        motionRef={motionRef}
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
