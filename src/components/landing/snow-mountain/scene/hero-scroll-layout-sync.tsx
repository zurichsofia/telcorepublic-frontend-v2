"use client";

import type { MutableRefObject, RefObject } from "react";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  readHeroScrollProgress,
} from "@/lib/snow-mountain/snow-mountain-hero-scroll";

import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";

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

  useEffect(() => {
    const markDirty = () => {
      resizeDirtyRef.current = true;
      lastScrollYRef.current = -1;
    };
    window.addEventListener("resize", markDirty);
    return () => window.removeEventListener("resize", markDirty);
  }, []);

  useFrame(() => {
    if (reduceMotion) return;

    const scrollY = window.scrollY;
    if (scrollY === lastScrollYRef.current && !resizeDirtyRef.current) return;
    lastScrollYRef.current = scrollY;
    resizeDirtyRef.current = false;

    const section = sectionRef.current;
    if (!section) return;

    const progress = readHeroScrollProgress(section);
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
