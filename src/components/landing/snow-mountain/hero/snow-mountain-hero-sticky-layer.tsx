"use client";

import type { MutableRefObject, ReactNode, RefObject } from "react";

import type { SnowMountainParallaxMotion } from "@/components/landing/snow-mountain/scene/snow-mountain-scene-clouds";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import { SnowMountainScene } from "@/components/landing/snow-mountain/scene/snow-mountain-scene";
import { SnowMountainSceneClouds } from "@/components/landing/snow-mountain/scene/snow-mountain-scene-clouds";
import { SnowMountainV2SimpleScene } from "@/components/landing/snow-mountain/scene/snow-mountain-v2-simple-scene";
import { cn } from "@/lib/utils";

export type SnowMountainHeroSceneVariant = "v1" | "v2";

type SnowMountainHeroStickyLayerProps = {
  sceneVariant?: SnowMountainHeroSceneVariant;
  reduceMotion: boolean;
  sceneActive?: boolean;
  heroSectionRef: RefObject<HTMLElement | null>;
  heroCanvasRef: RefObject<HTMLDivElement | null>;
  scrollState: HeroScrollState;
  motionRef: MutableRefObject<SnowMountainParallaxMotion>;
  children?: ReactNode;
};

export function SnowMountainHeroStickyLayer({
  sceneVariant = "v1",
  reduceMotion,
  sceneActive = true,
  heroSectionRef,
  heroCanvasRef,
  scrollState,
  motionRef,
  children,
}: SnowMountainHeroStickyLayerProps) {
  const isV2 = sceneVariant === "v2";

  return (
    <div className="sticky top-0 z-0 h-screen min-h-screen w-full shrink-0 overflow-hidden">
      <div
        ref={heroCanvasRef}
        className={cn(
          "absolute inset-0 z-0 min-h-screen contain-paint",
          !reduceMotion && "cursor-none",
        )}
      >
        {isV2 ? (
          <SnowMountainV2SimpleScene
            className={cn("size-full min-h-screen", !reduceMotion && "cursor-none")}
            scrollState={scrollState}
            heroSectionRef={heroSectionRef}
            motionRef={motionRef}
            reduceMotion={reduceMotion}
          />
        ) : (
          <SnowMountainScene
            scrollState={scrollState}
            heroSectionRef={heroSectionRef}
            motionRef={motionRef}
            sceneActive={sceneActive}
            className={!reduceMotion ? "cursor-none" : undefined}
          />
        )}
      </div>

      {!isV2 ? <div className="snow-mountain-hero-film" aria-hidden /> : null}

      {!isV2 ? (
        <SnowMountainSceneClouds
          scrollState={scrollState}
          sectionRef={heroSectionRef}
          reducedMotion={reduceMotion}
          sceneActive={sceneActive}
        />
      ) : null}

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
