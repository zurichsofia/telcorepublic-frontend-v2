"use client";

import type { MutableRefObject, RefObject } from "react";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import {
  dampHeroScrollProgress,
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  readHeroScrollProgress,
} from "@/lib/snow-mountain/snow-mountain-hero-scroll";

import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";
import { getLenisScrollY } from "@/lib/lenis-scroll";

type HeroScrollLayoutSyncProps = {
  sectionRef: RefObject<HTMLElement | null>;
  scrollState: HeroScrollState;
  motionRef: MutableRefObject<SnowMountainParallaxMotion>;
  reduceMotion: boolean;
};

/** One layout read per render frame — keeps camera, clouds, and copy in sync. */
export function HeroScrollLayoutSync({
  sectionRef,
  scrollState,
  motionRef,
  reduceMotion,
}: HeroScrollLayoutSyncProps) {
  const lastScrollYRef = useRef(-1);
  const resizeDirtyRef = useRef(true);
  const dampedProgressRef = useRef(0);

  useEffect(() => {
    const markDirty = () => {
      resizeDirtyRef.current = true;
      lastScrollYRef.current = -1;
      dampedProgressRef.current = 0;
    };
    window.addEventListener("resize", markDirty);
    return () => window.removeEventListener("resize", markDirty);
  }, []);

  useFrame((_, delta) => {
    if (reduceMotion) return;

    const scrollY = getLenisScrollY();
    const section = sectionRef.current;
    if (!section) return;

    const target = readHeroScrollProgress(section);
    const progress = dampHeroScrollProgress(
      dampedProgressRef.current,
      target,
      delta,
    );
    dampedProgressRef.current = progress;

    const stillCatchingUp = Math.abs(target - progress) >= 1e-4;
    if (
      scrollY === lastScrollYRef.current &&
      !resizeDirtyRef.current &&
      !stillCatchingUp
    ) {
      return;
    }
    lastScrollYRef.current = scrollY;
    resizeDirtyRef.current = false;

    scrollState.set(progress);
    motionRef.current = {
      x: heroPrimaryParallaxX(progress),
      y: heroPrimaryParallaxY(progress),
      scale: 1,
      scroll: progress,
    };
  }, -20);

  return null;
}
