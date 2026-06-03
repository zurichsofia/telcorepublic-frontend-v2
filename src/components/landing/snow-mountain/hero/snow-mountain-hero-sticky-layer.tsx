"use client";

import type { MutableRefObject, ReactNode, RefObject } from "react";

import type { SnowMountainParallaxMotion } from "@/components/landing/snow-mountain/scene/snow-mountain-scene-clouds";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import { SnowMountainScene } from "@/components/landing/snow-mountain/scene/snow-mountain-scene";
import { SnowMountainSceneClouds } from "@/components/landing/snow-mountain/scene/snow-mountain-scene-clouds";
import { cn } from "@/lib/utils";

type SnowMountainHeroStickyLayerProps = {
  reduceMotion: boolean;
  sceneActive?: boolean;
  heroSectionRef: RefObject<HTMLElement | null>;
  heroCanvasRef: RefObject<HTMLDivElement | null>;
  scrollState: HeroScrollState;
  motionRef: MutableRefObject<SnowMountainParallaxMotion>;
  children?: ReactNode;
};

export function SnowMountainHeroStickyLayer({
  reduceMotion,
  sceneActive = true,
  heroSectionRef,
  heroCanvasRef,
  scrollState,
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
          scrollState={scrollState}
          heroSectionRef={heroSectionRef}
          motionRef={motionRef}
          sceneActive={sceneActive}
          className={!reduceMotion ? "cursor-none" : undefined}
        />
      </div>

      <div className="snow-mountain-hero-film" aria-hidden />

      <SnowMountainSceneClouds
        scrollState={scrollState}
        sectionRef={heroSectionRef}
        reducedMotion={reduceMotion}
        sceneActive={sceneActive}
      />

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
