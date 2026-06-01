"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { isPastMountainView } from "@/lib/hero-nav-sync";
import { createHeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  readHeroScrollProgress,
} from "@/lib/snow-mountain/snow-mountain-hero-scroll";

import type { SnowMountainParallaxMotion } from "@/components/landing/snow-mountain/scene/snow-mountain-scene-clouds";
import { HERO_SECTION_VH } from "./snow-mountain-hero-scroll";
import { SnowMountainHeroMotionScrollLayers } from "./snow-mountain-hero-motion-scroll-layers";
import { SnowMountainHeroStickyLayer } from "./snow-mountain-hero-sticky-layer";

function isCursorGlowActive(canvas: HTMLDivElement | null): boolean {
  if (!canvas || isPastMountainView()) return false;
  const rect = canvas.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

export function SnowMountainHero() {
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const scrollState = useRef(createHeroScrollState(0)).current;
  const heroParallaxMotionRef = useRef<SnowMountainParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
    scroll: 0,
  });
  const [heroCursor, setHeroCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [sceneActive, setSceneActive] = useState(true);

  const syncProgress = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || reduce) return;

    const progress = readHeroScrollProgress(hero);
    scrollState.set(progress);
    heroParallaxMotionRef.current = {
      x: heroPrimaryParallaxX(progress),
      y: heroPrimaryParallaxY(progress),
      scale: 1,
      scroll: progress,
    };

    if (!isCursorGlowActive(heroCanvasRef.current)) {
      setHeroCursor(null);
    }
  }, [reduce, scrollState]);

  useLayoutEffect(() => {
    if (reduce) {
      scrollState.set(0);
      heroParallaxMotionRef.current = { x: 0, y: 0, scale: 1, scroll: 0 };
      return;
    }
    syncProgress();
  }, [reduce, scrollState, syncProgress]);

  useEffect(() => {
    if (reduce) {
      setSceneActive(false);
      return;
    }
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setSceneActive(entry?.isIntersecting ?? false);
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setHeroCursor(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const el = heroCanvasRef.current;
      if (!el || !isCursorGlowActive(el)) {
        setHeroCursor(null);
        return;
      }
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
      setHeroCursor({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      });
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
      <SnowMountainHeroStickyLayer
        reduceMotion={!!reduce}
        sceneActive={sceneActive}
        heroSectionRef={heroRef}
        heroCanvasRef={heroCanvasRef}
        scrollState={scrollState}
        motionRef={heroParallaxMotionRef}
        cursorGlowPosition={heroCursor}
      >
        <SnowMountainHeroMotionScrollLayers
          scrollState={scrollState}
          reduceMotion={!!reduce}
        />
      </SnowMountainHeroStickyLayer>

      <div aria-hidden className="min-h-0 w-full shrink-0 grow basis-0" />
    </section>
  );
}
