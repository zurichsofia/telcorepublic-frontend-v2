"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  type AnimationPlaybackControls,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  readHeroScrollProgress,
} from "@/lib/snow-mountain-hero-scroll";
import {
  HERO_EXIT_SNAP_START,
  HERO_PEEK_SNAP_RATIO,
  HERO_SECTION_VH,
  HERO_SNAP_BACK_PROGRESS,
} from "./hero-scroll";
import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMotionScrollLayers } from "./hero-motion-scroll-layers";
import { HeroScrollHint } from "./hero-scroll-hint";
import { HeroStickyLayer } from "./hero-sticky-layer";

const SNAP_EASE = [0.45, 0, 0.15, 1] as const;
const SNAP_DURATION = 0.9;
const SNAP_COOLDOWN_MS = 600;

function getHeroExitScrollY(section: HTMLElement): number {
  return section.offsetTop + section.offsetHeight;
}

function getHeroSnapBackScrollY(section: HTMLElement): number {
  return section.offsetTop + HERO_SNAP_BACK_PROGRESS * section.offsetHeight;
}

function getScrollElement(): HTMLElement {
  return (document.scrollingElement ?? document.documentElement) as HTMLElement;
}

function getHeroPeekRatio(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  if (viewport <= 0 || rect.bottom <= 0) return 0;
  if (rect.top >= 0) return Math.min(1, rect.height / viewport);
  return Math.min(1, rect.bottom / viewport);
}

function shouldSnapForward(section: HTMLElement): boolean {
  const progress = readHeroScrollProgress(section);
  return progress >= HERO_EXIT_SNAP_START && progress < 0.998;
}

function shouldSnapBack(section: HTMLElement): boolean {
  const progress = readHeroScrollProgress(section);
  const peek = getHeroPeekRatio(section);
  const exitY = getHeroExitScrollY(section);
  const scrollY = window.scrollY;

  if (progress >= HERO_EXIT_SNAP_START && progress < 0.998) return true;

  return (
    scrollY > exitY - window.innerHeight * HERO_PEEK_SNAP_RATIO &&
    peek >= HERO_PEEK_SNAP_RATIO
  );
}

export function SnowMountainHero() {
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const heroParallaxMotionRef = useRef<HeroParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const heroProgress = useMotionValue(0);
  const isSnappingRef = useRef(false);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const lastScrollYRef = useRef(0);
  const lastScrollDirectionRef = useRef(0);
  const snapCooldownUntilRef = useRef(0);
  const [heroCursor, setHeroCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollHintOpacity = useTransform(heroProgress, [0.65, 0.88], [1, 0]);

  const syncParallax = useCallback(
    (latest: number) => {
      if (reduce) {
        heroParallaxMotionRef.current = { x: 0, y: 0, scale: 1 };
        return;
      }
      heroParallaxMotionRef.current = {
        x: heroPrimaryParallaxX(latest),
        y: heroPrimaryParallaxY(latest),
        scale: 1,
      };
    },
    [reduce],
  );

  const runSnap = useCallback(
    (targetY: number, targetProgress: number) => {
      const hero = heroRef.current;
      if (!hero || isSnappingRef.current) return;
      if (performance.now() < snapCooldownUntilRef.current) return;

      const startY = window.scrollY;
      const startProgress = heroProgress.get();

      if (Math.abs(startY - targetY) < 4) return;

      isSnappingRef.current = true;
      controlsRef.current?.stop();

      controlsRef.current = animate(0, 1, {
        duration: SNAP_DURATION,
        ease: SNAP_EASE,
        onUpdate: (t) => {
          const progress = startProgress + (targetProgress - startProgress) * t;
          const scrollY = startY + (targetY - startY) * t;

          getScrollElement().scrollTop = scrollY;
          heroProgress.set(progress);
          syncParallax(progress);
          lastScrollYRef.current = scrollY;
        },
        onComplete: () => {
          getScrollElement().scrollTop = targetY;
          const settledProgress = readHeroScrollProgress(hero);
          heroProgress.set(settledProgress);
          syncParallax(settledProgress);
          isSnappingRef.current = false;
          controlsRef.current = null;
          lastScrollYRef.current = targetY;
          snapCooldownUntilRef.current = performance.now() + SNAP_COOLDOWN_MS;
        },
      });
    },
    [heroProgress, syncParallax],
  );

  const snapToNextSection = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || reduce || isSnappingRef.current) return;
    if (!shouldSnapForward(hero)) return;
    runSnap(getHeroExitScrollY(hero), 1);
  }, [reduce, runSnap]);

  const snapToHero = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || reduce || isSnappingRef.current) return;
    if (!shouldSnapBack(hero)) return;
    runSnap(getHeroSnapBackScrollY(hero), HERO_SNAP_BACK_PROGRESS);
  }, [reduce, runSnap]);

  const tryDirectionalSnap = useCallback(
    (direction: number) => {
      if (direction > 0) snapToNextSection();
      else if (direction < 0) snapToHero();
    },
    [snapToHero, snapToNextSection],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (isSnappingRef.current) return;
    heroProgress.set(progress);
    syncParallax(progress);
  });

  useLayoutEffect(() => {
    const progress = reduce ? 0 : scrollYProgress.get();
    heroProgress.set(progress);
    syncParallax(progress);
  }, [reduce, scrollYProgress, syncParallax, heroProgress]);

  useEffect(() => {
    if (reduce) return;

    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      if (isSnappingRef.current) return;

      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      if (Math.abs(delta) >= 1) {
        lastScrollDirectionRef.current = delta > 0 ? 1 : -1;
      }
    };

    const onScrollEnd = () => {
      if (
        isSnappingRef.current ||
        lastScrollDirectionRef.current === 0 ||
        performance.now() < snapCooldownUntilRef.current
      ) {
        return;
      }
      tryDirectionalSnap(lastScrollDirectionRef.current);
    };

    const onWheel = (event: WheelEvent) => {
      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }
      if (performance.now() < snapCooldownUntilRef.current) return;

      const hero = heroRef.current;
      if (!hero || Math.abs(event.deltaY) < 2) return;

      if (event.deltaY > 0 && shouldSnapForward(hero)) {
        event.preventDefault();
        snapToNextSection();
        return;
      }

      if (event.deltaY < 0 && shouldSnapBack(hero)) {
        event.preventDefault();
        snapToHero();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("wheel", onWheel);
      controlsRef.current?.stop();
      controlsRef.current = null;
      isSnappingRef.current = false;
    };
  }, [reduce, snapToHero, snapToNextSection, tryDirectionalSnap]);

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
        heroProgress={heroProgress}
        isSnappingRef={isSnappingRef}
        motionRef={heroParallaxMotionRef}
      >
        <HeroMotionScrollLayers
          scrollYProgress={heroProgress}
          reduceMotion={!!reduce}
        />
      </HeroStickyLayer>

      {!reduce && heroCursor != null ? (
        <HeroCursorGlow position={heroCursor} />
      ) : null}

      {/* <HeroScrollHint scrollOpacity={reduce ? undefined : scrollHintOpacity} /> */}

      {/* Fills remaining height between sticky (100vh) and section total. */}
      <div
        aria-hidden
        className="min-h-0 w-full shrink-0 grow basis-0"
      />
    </section>
  );
}
