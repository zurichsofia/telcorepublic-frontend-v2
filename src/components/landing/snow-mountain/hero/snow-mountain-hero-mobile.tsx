"use client";

import { useRef } from "react";

import { useHeroFixedPin } from "@/hooks/use-hero-fixed-pin";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { createHeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import {
  MOBILE_VIEWPORT_HEIGHT,
  mobileHeroSectionHeight,
} from "@/lib/viewport-css-vars";
import { cn } from "@/lib/utils";

import { SnowMountainMobileScene } from "../scene/snow-mountain-mobile-scene";
import { SnowMountainHeroMotionScrollLayers } from "./snow-mountain-hero-motion-scroll-layers";
import { SnowMountainHeroOverlay } from "./snow-mountain-hero-overlay";
import { HERO_MOBILE_SECTION_VH } from "./snow-mountain-hero-scroll";

/** Mobile hero — fixed pin + dedicated lightweight scene (no sticky, no Lenis). */
export function SnowMountainHeroMobile() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollState = useRef(createHeroScrollState(0)).current;
  const { phase, metricsRef } = useHeroFixedPin(sectionRef);
  const sectionHeight = mobileHeroSectionHeight(HERO_MOBILE_SECTION_VH);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative"
      style={{
        height: sectionHeight,
        minHeight: sectionHeight,
        overflowAnchor: "none",
      }}
    >
      {phase !== "before" ? (
        <div
          className="shrink-0"
          style={{ height: MOBILE_VIEWPORT_HEIGHT }}
          aria-hidden
        />
      ) : null}

      <div
        className={cn(
          "w-full overflow-hidden",
          phase === "pinned" && "fixed inset-x-0 top-0 z-0",
          phase === "after" && "absolute inset-x-0",
        )}
        style={{
          height: MOBILE_VIEWPORT_HEIGHT,
          minHeight: MOBILE_VIEWPORT_HEIGHT,
          top: phase === "after" ? metricsRef.current.pinPx : undefined,
        }}
      >
        <SnowMountainMobileScene
          className="size-full"
          scrollState={scrollState}
          pinMetricsRef={metricsRef}
          heroSectionRef={sectionRef}
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
