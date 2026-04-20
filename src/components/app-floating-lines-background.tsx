"use client";

import { useEffect, useRef } from "react";

import FloatingLines from "@/components/FloatingLines";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const HERO_ID = "hero";

/**
 * Builds a clip-path that shows the full viewport except for a rectangular hole
 * (hero on screen). When the hero does not intersect the viewport, no hole.
 */
function clipPathExcludingHeroRect(
  vw: number,
  vh: number,
  hero: DOMRect,
): string {
  const iTop = Math.max(0, hero.top);
  const iLeft = Math.max(0, hero.left);
  const iRight = Math.min(vw, hero.right);
  const iBottom = Math.min(vh, hero.bottom);
  if (iRight <= iLeft || iBottom <= iTop) {
    return "none";
  }
  const L = iLeft;
  const T = iTop;
  const R = iRight;
  const B = iBottom;
  return `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${L}px ${T}px, ${R}px ${T}px, ${R}px ${B}px, ${L}px ${B}px, ${L}px ${T}px)`;
}

/**
 * Site-wide fixed WebGL backdrop (z-0). The layer is clipped so it never paints
 * under `#hero` (service video hero). Editorial below the fold stays transparent
 * so this shows through `main` (z-10, no fill).
 */
export function AppFloatingLinesBackground() {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let rafId = 0;
    let scheduled = false;

    const apply = () => {
      const heroEl = document.getElementById(HERO_ID);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (!heroEl) {
        el.style.clipPath = "none";
        return;
      }
      el.style.clipPath = clipPathExcludingHeroRect(vw, vh, heroEl.getBoundingClientRect());
    };

    const run = () => {
      scheduled = false;
      rafId = 0;
      apply();
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(run);
    };

    apply();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : null;
    const heroEl = document.getElementById(HERO_ID);
    if (ro && heroEl) ro.observe(heroEl);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro?.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (reduceMotion) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 min-h-dvh w-full bg-white"
    >
      <FloatingLines
        lightBackground
        interactive={false}
        parallax
        consolidateWavesOnEditorialScroll
        scrollBiasedFieldLayout
        scrollParallaxStrength={8}
        animationSpeed={0.42}
        linesGradient={["#e8ecf0", "#eb1e25", "#c8d0d8", "#c4b4b8", "#9aa3ad"]}
        enabledWaves={["middle", "bottom"]}
        lineCount={[10, 10]}
        lineDistance={[10, 10]}
        // topWavePosition={{ x: -4.4, y: -0.2, rotate: -0.65 }}
        middleWavePosition={{ x: -0.8, y: -0.2, rotate: -0.40 }}
        bottomWavePosition={{ x: 4.4, y: -0.88, rotate: -0.65 }}
      />
    </div>
  );
}
