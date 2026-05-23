"use client";

import type { MutableRefObject, ReactNode, RefObject } from "react";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import type { ScrollProgressStore } from "@/lib/scroll-progress";
import { SnowMountainScene } from "@/components/snow-mountain-scene";
import { cn } from "@/lib/utils";

type HeroStickyLayerProps = {
  reduceMotion: boolean;
  heroCanvasRef: RefObject<HTMLDivElement | null>;
  heroSectionRef: RefObject<HTMLElement | null>;
  heroProgress: ScrollProgressStore;
  isSnappingRef: MutableRefObject<boolean>;
  motionRef: MutableRefObject<HeroParallaxMotion>;
  /** Copy + UI drawn in the same pinned viewport as the WebGL mountain. */
  children?: ReactNode;
};

export function HeroStickyLayer({
  reduceMotion,
  heroCanvasRef,
  heroSectionRef,
  heroProgress,
  isSnappingRef,
  motionRef,
  children,
}: HeroStickyLayerProps) {
  return (
    <div className="sticky top-0 z-0 h-screen min-h-screen w-full shrink-0 overflow-hidden">
      <div
        ref={heroCanvasRef}
        className={cn(
          "absolute inset-0 z-0 min-h-screen contain-paint",
          !reduceMotion && "cursor-none",
        )}
      >
        <SnowMountainScene
          heroSectionRef={heroSectionRef}
          heroProgress={heroProgress}
          isSnappingRef={isSnappingRef}
          motionRef={motionRef}
          className={!reduceMotion ? "cursor-none" : undefined}
        />
      </div>

      <div className="snow-mountain-hero-film" aria-hidden />

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
