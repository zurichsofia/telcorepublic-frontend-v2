"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { SNOW_MOUNTAIN_FOG_COLOR } from "@/lib/snow-mountain-fog";
import { cn } from "@/lib/utils";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  readHeroScrollProgress,
} from "@/lib/snow-mountain-hero-scroll";
import {
  applyHeroScrollVars,
  HERO_SCROLL_VARS_INITIAL,
  HERO_SECTION_VH,
  HERO_STICKY_SCROLL_VH,
} from "./hero-scroll";
import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMidContent } from "./hero-mid-content";
import { Navitation } from "../landing/navigation";
import { HeroPrimaryContent } from "./hero-primary-content";
import { HeroScrollHint } from "./hero-scroll-hint";
import { HeroStickyLayer } from "./hero-sticky-layer";

export function SnowMountainHero() {
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef(0);
  const heroParallaxMotionRef = useRef<HeroParallaxMotion>({
    x: 0,
    y: 0,
    scale: 1,
  });
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

  /**
   * Same progress as WebGL: `readHeroScrollProgress` from layout every frame (RAF), not
   * Motion’s scroll pipeline (different phase than R3F → felt laggy / non‑continuous).
   * Scroll/resize listeners kick an extra flush so the first paint after layout jumps is right.
   */
  useLayoutEffect(() => {
    const flush = () => {
      const el = heroRef.current;
      const p = readHeroScrollProgress(el);
      scrollProgressRef.current = reduce ? 0 : p;
      if (el) applyHeroScrollVars(el, p, reduce);
      if (reduce) {
        heroParallaxMotionRef.current = { x: 0, y: 0, scale: 1 };
      } else {
        heroParallaxMotionRef.current = {
          x: heroPrimaryParallaxX(p),
          y: heroPrimaryParallaxY(p),
          scale: 1,
        };
      }
    };
    let raf = 0;
    const tick = () => {
      flush();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onScrollOrResize = () => flush();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [reduce]);

  return (
    <section
      ref={heroRef}
      id="summit"
      // className="relative isolate z-20 [--color-heading:#001538] [--accent-hover:#0891b2]"
      style={{
        // backgroundColor: SNOW_MOUNTAIN_FOG_COLOR,
        position: "relative",
        height: `${HERO_SECTION_VH}vh`,
        minHeight: `${HERO_SECTION_VH}vh`,
        ...HERO_SCROLL_VARS_INITIAL,
      }}
    >
      <HeroStickyLayer
        reduceMotion={!!reduce}
        heroCanvasRef={heroCanvasRef}
        heroSectionRef={heroRef}
        scrollProgressRef={scrollProgressRef}
        motionRef={heroParallaxMotionRef}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 flex flex-col",
          !reduce && "cursor-none [&_a]:cursor-pointer",
        )}
      >
        <div className="pointer-events-auto">
          <Navitation />
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
