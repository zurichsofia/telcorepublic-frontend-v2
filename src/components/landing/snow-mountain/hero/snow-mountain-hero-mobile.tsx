"use client";

import { useRef } from "react";

import { useHeroFixedPin } from "@/hooks/use-hero-fixed-pin";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { createHeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import { cn } from "@/lib/utils";

import { SnowMountainMobileScene } from "../scene/snow-mountain-mobile-scene";
import { SnowMountainHeroMotionScrollLayers } from "./snow-mountain-hero-motion-scroll-layers";
import { SnowMountainHeroOverlay } from "./snow-mountain-hero-overlay";
import { HERO_SECTION_VH } from "./snow-mountain-hero-scroll";

/** Mobile hero — fixed pin + dedicated lightweight scene (no sticky, no Lenis). */
export function SnowMountainHeroMobile() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollState = useRef(createHeroScrollState(0)).current;
  const { phase, metricsRef } = useHeroFixedPin(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative"
      style={{
        height: `${HERO_SECTION_VH}svh`,
        minHeight: `${HERO_SECTION_VH}svh`,
      }}
    >
      {phase !== "before" ? (
        <div className="h-svh shrink-0" aria-hidden />
      ) : null}

      <div
        className={cn(
          "h-svh w-full overflow-hidden",
          phase === "pinned" && "fixed inset-x-0 top-0 z-0",
          phase === "after" && "absolute inset-x-0 bottom-0",
        )}
      >
        <SnowMountainMobileScene
          className="size-full"
          scrollState={scrollState}
          pinMetricsRef={metricsRef}
          reduceMotion={!!reduce}
        />

        <SnowMountainHeroOverlay className="max-w-7xl">
          <SnowMountainHeroMotionScrollLayers
            scrollState={scrollState}
            reduceMotion={!!reduce}
          />
        </SnowMountainHeroOverlay>
      </div>
    </section>
  );
}
