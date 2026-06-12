"use client";

import type { MutableRefObject, ReactNode, RefObject } from "react";

import { SnowMountainV2SimpleScene } from "@/components/landing/snow-mountain/scene/snow-mountain-scene";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";
import { cn } from "@/lib/utils";

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
  return (
    <div
      ref={stickyRef}
      className="sticky top-0 z-0 h-screen min-h-screen w-full shrink-0 overflow-hidden"
    >
      <div
        className={cn(
          "absolute inset-0 z-0 min-h-screen contain-paint",
          !reduceMotion && "cursor-none",
        )}
      >
        <SnowMountainV2SimpleScene
          className={cn("size-full min-h-screen", !reduceMotion && "cursor-none")}
          scrollState={scrollState}
          heroSectionRef={heroSectionRef}
          motionRef={motionRef}
          reduceMotion={reduceMotion}
        />
      </div>

      {children != null ? (
        <div className="pointer-events-none absolute inset-0 z-20 bg-transparent">
          <div
            className={cn(
              "relative mx-auto h-full w-full max-w-[1400px]",
              !reduceMotion && "cursor-none [&_a]:cursor-pointer",
            )}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
