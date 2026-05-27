"use client";

import type { MutableRefObject, ReactNode, RefObject } from "react";

import type { SnowMountainParallaxMotion } from "@/components/landing/snow-mountain/scene/snow-mountain-scene-clouds";
import type { ScrollProgressStore } from "@/lib/snow-mountain/scroll-progress";
import { SnowMountainScene } from "@/components/landing/snow-mountain/scene/snow-mountain-scene";
import { cn } from "@/lib/utils";

type SnowMountainHeroStickyLayerProps = {
  reduceMotion: boolean;
  heroCanvasRef: RefObject<HTMLDivElement | null>;
  heroSectionRef: RefObject<HTMLElement | null>;
  heroProgress: ScrollProgressStore;
  motionRef: MutableRefObject<SnowMountainParallaxMotion>;
  children?: ReactNode;
};

export function SnowMountainHeroStickyLayer({
  reduceMotion,
  heroCanvasRef,
  heroSectionRef,
  heroProgress,
  motionRef,
  children,
}: SnowMountainHeroStickyLayerProps) {
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
