"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useLenis } from "@/components/common/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  cubicBezierEase,
  HERO_SNAP_EASE,
  scrollScrubLerp,
} from "@/lib/snow-mountain-scroll-easing";
import { createScrollProgressStore } from "@/lib/scroll-progress";

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
import { HeroStickyLayer } from "./hero-sticky-layer";

const SNAP_DURATION = 1.05;
const SNAP_COOLDOWN_MS = 750;

function getHeroExitScrollY(section: HTMLElement): number {
  return section.offsetTop + section.offsetHeight;
}

function getHeroSnapBackScrollY(section: HTMLElement): number {
  return section.offsetTop + HERO_SNAP_BACK_PROGRESS * section.offsetHeight;
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
  const lenis = useLenis();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const heroParallaxMotionRef = useRef<HeroParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const heroProgressStore = useRef(createScrollProgressStore(0)).current;
  /** Scrub-smoothed progress for camera + copy — lags slightly behind scroll like mont-fort. */
  const displayProgressStore = useRef(createScrollProgressStore(0)).current;
  const isSnappingRef = useRef(false);
  const snapTokenRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastScrollDirectionRef = useRef(0);
  const snapCooldownUntilRef = useRef(0);
  const [heroCursor, setHeroCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

  const settleProgressFromLayout = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const settled = readHeroScrollProgress(hero);
    heroProgressStore.set(settled);
    displayProgressStore.set(settled);
    syncParallax(settled);
  }, [displayProgressStore, heroProgressStore, syncParallax]);

  const runSnap = useCallback(
    (targetY: number) => {
      const hero = heroRef.current;
      if (!hero || isSnappingRef.current) return;
      if (performance.now() < snapCooldownUntilRef.current) return;

      const startY = window.scrollY;
      if (Math.abs(startY - targetY) < 6) return;

      isSnappingRef.current = true;
      const token = ++snapTokenRef.current;

      const finishSnap = () => {
        if (token !== snapTokenRef.current) return;
        settleProgressFromLayout();
        isSnappingRef.current = false;
        snapCooldownUntilRef.current = performance.now() + SNAP_COOLDOWN_MS;
      };

      if (lenis) {
        const onSnapScroll = () => {
          if (token !== snapTokenRef.current) return;
          heroProgressStore.set(readHeroScrollProgress(hero));
        };
        const unsubSnapScroll = lenis.on("scroll", onSnapScroll);

        lenis.scrollTo(targetY, {
          duration: SNAP_DURATION,
          easing: (t) => cubicBezierEase(HERO_SNAP_EASE, t),
          lock: true,
          force: true,
          onComplete: () => {
            unsubSnapScroll();
            finishSnap();
          },
        });
        return;
      }

      const startProgress = heroProgressStore.get();
      const startTime = performance.now();
      const durationMs = SNAP_DURATION * 1000;

      const tick = (now: number) => {
        if (token !== snapTokenRef.current) return;
        const rawT = Math.min(1, (now - startTime) / durationMs);
        const t = cubicBezierEase(HERO_SNAP_EASE, rawT);
        const scrollY = startY + (targetY - startY) * t;
        window.scrollTo(0, scrollY);

        const layoutProgress = readHeroScrollProgress(hero);
        const blended = startProgress + (layoutProgress - startProgress) * t;
        heroProgressStore.set(blended);
        displayProgressStore.set(blended);
        syncParallax(blended);

        if (rawT < 1) {
          requestAnimationFrame(tick);
        } else {
          finishSnap();
        }
      };

      requestAnimationFrame(tick);
    },
    [displayProgressStore, heroProgressStore, lenis, settleProgressFromLayout, syncParallax],
  );

  const snapToNextSection = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || reduce || isSnappingRef.current) return;
    if (!shouldSnapForward(hero)) return;
    runSnap(getHeroExitScrollY(hero));
  }, [reduce, runSnap]);

  const snapToHero = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || reduce || isSnappingRef.current) return;
    if (!shouldSnapBack(hero)) return;
    runSnap(getHeroSnapBackScrollY(hero));
  }, [reduce, runSnap]);

  const tryDirectionalSnap = useCallback(
    (direction: number) => {
      if (direction > 0) snapToNextSection();
      else if (direction < 0) snapToHero();
    },
    [snapToHero, snapToNextSection],
  );

  useLayoutEffect(() => {
    const progress = reduce ? 0 : readHeroScrollProgress(heroRef.current);
    heroProgressStore.set(progress);
    displayProgressStore.set(progress);
    syncParallax(progress);
  }, [reduce, syncParallax, heroProgressStore, displayProgressStore]);

  /* Lenis drives scroll position; layout + scrub loop derive hero progress. */
  useEffect(() => {
    if (reduce) return;

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 1 / 24);
      lastTime = now;

      const hero = heroRef.current;
      if (!isSnappingRef.current && hero) {
        heroProgressStore.set(readHeroScrollProgress(hero));
      }

      if (isSnappingRef.current) {
        const snapped = heroProgressStore.get();
        displayProgressStore.set(snapped);
        syncParallax(snapped);
      } else {
        const target = heroProgressStore.get();
        const current = displayProgressStore.get();
        const lerp = scrollScrubLerp(delta, 0.12);
        const next = current + (target - current) * lerp;
        displayProgressStore.set(next);
        syncParallax(next);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduce, displayProgressStore, heroProgressStore, syncParallax]);

  useEffect(() => {
    if (reduce) return;

    lastScrollYRef.current = window.scrollY;

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

    const onScroll = () => {
      if (isSnappingRef.current) return;

      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      if (Math.abs(delta) >= 0.5) {
        lastScrollDirectionRef.current = delta > 0 ? 1 : -1;
      }
    };

    const onWindowScrollEnd = (event: Event) => {
      if (lenis && event instanceof CustomEvent && !event.detail?.lenisScrollEnd) {
        return;
      }
      onScrollEnd();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onWindowScrollEnd, { passive: true });

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let lenisOff: (() => void) | undefined;
    if (lenis) {
      const onLenisScroll = () => {
        onScroll();
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(onScrollEnd, 140);
      };
      lenisOff = lenis.on("scroll", onLenisScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onWindowScrollEnd);
      lenisOff?.();
      if (idleTimer) clearTimeout(idleTimer);
      snapTokenRef.current += 1;
      isSnappingRef.current = false;
    };
  }, [reduce, lenis, tryDirectionalSnap]);

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
        heroProgress={displayProgressStore}
        isSnappingRef={isSnappingRef}
        motionRef={heroParallaxMotionRef}
      >
        <HeroMotionScrollLayers
          scrollProgress={displayProgressStore}
          reduceMotion={!!reduce}
        />
      </HeroStickyLayer>

      {!reduce && heroCursor != null ? (
        <HeroCursorGlow position={heroCursor} />
      ) : null}

      {/* Fills remaining height between sticky (100vh) and section total. */}
      <div
        aria-hidden
        className="min-h-0 w-full shrink-0 grow basis-0"
      />
    </section>
  );
}
