"use client";

import type { MutableRefObject, RefObject } from "react";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import { SnowMountainScene } from "@/components/snow-mountain-scene";
import { cn } from "@/lib/utils";

type HeroStickyLayerProps = {
  reduceMotion: boolean;
  heroCanvasRef: RefObject<HTMLDivElement | null>;
  /** Same element as `<section ref={…}>` — WebGL reads progress from its layout each frame. */
  heroSectionRef: RefObject<HTMLElement | null>;
  scrollProgressRef: MutableRefObject<number>;
  motionRef: MutableRefObject<HeroParallaxMotion>;
};

export function HeroStickyLayer({
  reduceMotion,
  heroCanvasRef,
  heroSectionRef,
  scrollProgressRef,
  motionRef,
}: HeroStickyLayerProps) {
  return (
    <div className="sticky top-0 z-0 h-dvh min-h-dvh w-full overflow-hidden contain-[layout]">
      <div
        ref={heroCanvasRef}
        className={cn(
          "absolute inset-0 min-h-dvh contain-paint",
          !reduceMotion && "cursor-none",
        )}
      >
        <SnowMountainScene
          heroSectionRef={heroSectionRef}
          scrollProgressRef={scrollProgressRef}
          motionRef={motionRef}
          className={!reduceMotion ? "cursor-none" : undefined}
        />
      </div>

      {/* TODO: bottom gradient */}
      {/* <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(42vh,28rem)] bg-gradient-to-t from-[#0c1828] via-[#0a1420]/88 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#08121c] to-transparent opacity-85"
          aria-hidden
        /> */}

      <div className="snow-mountain-hero-film" aria-hidden />
    </div>
  );
}
