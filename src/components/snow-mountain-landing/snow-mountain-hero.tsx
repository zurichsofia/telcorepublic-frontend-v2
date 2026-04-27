"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import type { HeroParallaxMotion } from "@/components/landing/hero-clouds-three";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
} from "@/lib/snow-mountain-hero-scroll";
import { HERO_SECTION_VH } from "./hero-scroll";
import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMotionScrollLayers } from "./hero-motion-scroll-layers";
import { HeroScrollHint } from "./hero-scroll-hint";
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
  const [heroCursor, setHeroCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollHintOpacity = useTransform(scrollYProgress, [0.65, 0.88], [1, 0]);

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

  useMotionValueEvent(scrollYProgress, "change", syncParallax);

  useLayoutEffect(() => {
    syncParallax(reduce ? 0 : scrollYProgress.get());
  }, [reduce, scrollYProgress, syncParallax]);

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
      style={{
        position: "relative",
        height: `${HERO_SECTION_VH}vh`,
        minHeight: `${HERO_SECTION_VH}vh`,
      }}
    >
      <HeroStickyLayer
        reduceMotion={!!reduce}
        heroCanvasRef={heroCanvasRef}
        heroSectionRef={heroRef}
        motionRef={heroParallaxMotionRef}
      >
        <HeroMotionScrollLayers
          scrollYProgress={scrollYProgress}
          reduceMotion={!!reduce}
        />
      </HeroStickyLayer>

      {!reduce && heroCursor != null ? (
        <HeroCursorGlow position={heroCursor} />
      ) : null}

      <HeroScrollHint scrollOpacity={reduce ? undefined : scrollHintOpacity} />
    </section>
  );
}
