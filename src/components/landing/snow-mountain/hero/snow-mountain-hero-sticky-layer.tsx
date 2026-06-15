"use client";

import type { MutableRefObject, ReactNode, RefObject } from "react";

import { SnowMountainV2SimpleScene } from "@/components/landing/snow-mountain/scene/snow-mountain-scene";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";
import { cn } from "@/lib/utils";

import { SnowMountainHeroOverlay } from "./snow-mountain-hero-overlay";

type SnowMountainHeroStickyLayerProps = {
  reduceMotion: boolean;
  heroSectionRef: RefObject<HTMLElement | null>;
  stickyRef: RefObject<HTMLDivElement | null>;
  scrollState: HeroScrollState;
  motionRef: MutableRefObject<SnowMountainParallaxMotion>;
  children?: ReactNode;
};

export function SnowMountainHeroStickyLayer({
  reduceMotion,
  heroSectionRef,
  stickyRef,
  scrollState,
  motionRef,
  children,
}: SnowMountainHeroStickyLayerProps) {
  const hideCursor = !reduceMotion;

  return (
    <div
      ref={stickyRef}
      className="sticky top-0 z-0 h-screen w-full shrink-0 overflow-hidden"
    >
      <div
        className={cn(
          "absolute inset-0 contain-paint",
          hideCursor && "cursor-none",
        )}
      >
        <SnowMountainV2SimpleScene
          className="size-full"
          scrollState={scrollState}
          heroSectionRef={heroSectionRef}
          motionRef={motionRef}
          reduceMotion={reduceMotion}
        />
      </div>

      {children ? (
        <SnowMountainHeroOverlay hideCursor={hideCursor}>
          {children}
        </SnowMountainHeroOverlay>
      ) : null}
    </div>
  );
}
