"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { subscribeLenisScroll, isLenisActive } from "@/lib/lenis-scroll";
import { createScrollProgressStore } from "@/lib/scroll-progress";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  readHeroScrollProgress,
} from "@/lib/snow-mountain-hero-scroll";
import { HERO_SECTION_VH } from "./hero-scroll";
import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMotionScrollLayers } from "./hero-motion-scroll-layers";
import { HeroStickyLayer } from "./hero-sticky-layer";

export function SnowMountainHero() {
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const heroParallaxMotionRef = useRef<HeroParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const scrollProgress = useRef(createScrollProgressStore(0)).current;
  const [heroCursor, setHeroCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const syncFromScroll = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || reduce) return;

    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0) {
      if (scrollProgress.get() !== 1) {
        scrollProgress.set(1);
        heroParallaxMotionRef.current = {
          x: heroPrimaryParallaxX(1),
          y: heroPrimaryParallaxY(1),
          scale: 1,
        };
      }
      return;
    }

    const progress = readHeroScrollProgress(hero);
    if (scrollProgress.get() === progress) return;

    scrollProgress.set(progress);
    heroParallaxMotionRef.current = {
      x: heroPrimaryParallaxX(progress),
      y: heroPrimaryParallaxY(progress),
      scale: 1,
    };
  }, [reduce, scrollProgress]);

  useLayoutEffect(() => {
    if (reduce) {
      scrollProgress.set(0);
      heroParallaxMotionRef.current = { x: 0, y: 0, scale: 1 };
      return;
    }
    syncFromScroll();
  }, [reduce, scrollProgress, syncFromScroll]);

  useEffect(() => {
    if (reduce) return;
    syncFromScroll();
    const offLenis = subscribeLenisScroll(syncFromScroll);
    const onNativeScroll = () => {
      if (!isLenisActive()) syncFromScroll();
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    return () => {
      offLenis();
      window.removeEventListener("scroll", onNativeScroll);
    };
  }, [reduce, syncFromScroll]);

  useEffect(() => {
    if (reduce) {
      setHeroCursor(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const el = heroCanvasRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        setHeroCursor(null);
        return;
      }
      setHeroCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-0 flex-col"
      style={{
        height: `${HERO_SECTION_VH}vh`,
        minHeight: `${HERO_SECTION_VH}vh`,
      }}
    >
      <HeroStickyLayer
        reduceMotion={!!reduce}
        heroCanvasRef={heroCanvasRef}
        heroSectionRef={heroRef}
        heroProgress={scrollProgress}
        motionRef={heroParallaxMotionRef}
      >
        <HeroMotionScrollLayers
          scrollProgress={scrollProgress}
          reduceMotion={!!reduce}
        />
      </HeroStickyLayer>

      {!reduce && heroCursor != null ? (
        <HeroCursorGlow position={heroCursor} />
      ) : null}

      <div aria-hidden className="min-h-0 w-full shrink-0 grow basis-0" />
    </section>
  );
}
