"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

import { SNOW_MOUNTAIN_FOG_COLOR } from "@/lib/snow-mountain-fog";
import { cn } from "@/lib/utils";

import {
  applyHeroScrollVars,
  HERO_SCROLL_VARS_INITIAL,
  HERO_SECTION_VH,
  HERO_STICKY_SCROLL_VH,
} from "./hero-scroll";
import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMidContent } from "./hero-mid-content";
import { HeroNav } from "./hero-nav";
import { HeroPrimaryContent } from "./hero-primary-content";
import { HeroScrollHint } from "./hero-scroll-hint";
import { HeroStickyLayer } from "./hero-sticky-layer";

export function SnowMountainHero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef(0);
  const [heroCursor, setHeroCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    scrollProgressRef.current = reduce ? 0 : p;
    const el = heroRef.current;
    if (el) applyHeroScrollVars(el, p, reduce);
  });

  useLayoutEffect(() => {
    const p = scrollYProgress.get();
    scrollProgressRef.current = reduce ? 0 : p;
    const el = heroRef.current;
    if (el) applyHeroScrollVars(el, p, reduce);
  }, [reduce, scrollYProgress]);

  return (
    <section
      ref={heroRef}
      id="summit"
      className="relative isolate z-20 [--color-heading:#001538] [--accent-hover:#0891b2]"
      style={{
        backgroundColor: SNOW_MOUNTAIN_FOG_COLOR,
        height: `${HERO_SECTION_VH}vh`,
        minHeight: `${HERO_SECTION_VH}vh`,
        ...HERO_SCROLL_VARS_INITIAL,
      }}
    >
      <HeroStickyLayer
        reduceMotion={!!reduce}
        heroCanvasRef={heroCanvasRef}
        scrollProgressRef={scrollProgressRef}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 flex flex-col",
          !reduce && "cursor-none [&_a]:cursor-pointer",
        )}
      >
        <div className="pointer-events-auto">
          <HeroNav />
        </div>

        <HeroPrimaryContent reduceMotion={!!reduce} />
        <HeroMidContent reduceMotion={reduce} />

        <div
          className="shrink-0"
          style={{ minHeight: `${HERO_STICKY_SCROLL_VH / 2}vh` }}
          aria-hidden
        />
      </div>

      {!reduce && heroCursor != null ? (
        <HeroCursorGlow position={heroCursor} />
      ) : null}

      <HeroScrollHint />
    </section>
  );
}
