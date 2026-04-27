"use client";

import type { MutableRefObject, ReactNode, RefObject } from "react";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import { SnowMountainScene } from "@/components/snow-mountain-scene";
import { cn } from "@/lib/utils";

type HeroStickyLayerProps = {
  reduceMotion: boolean;
  heroCanvasRef: RefObject<HTMLDivElement | null>;
  heroSectionRef: RefObject<HTMLElement | null>;
  motionRef: MutableRefObject<HeroParallaxMotion>;
  /** Copy + UI drawn in the same pinned viewport as the WebGL mountain. */
  children?: ReactNode;
};

export function HeroStickyLayer({
  reduceMotion,
  heroCanvasRef,
  heroSectionRef,
  motionRef,
  children,
}: HeroStickyLayerProps) {
  return (
    <div className="sticky top-0 z-0 h-dvh min-h-dvh w-full overflow-hidden">
      <div
        ref={heroCanvasRef}
        className={cn(
          "absolute inset-0 z-0 min-h-dvh contain-paint",
          !reduceMotion && "cursor-none",
        )}
      >
        <SnowMountainScene
          heroSectionRef={heroSectionRef}
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
