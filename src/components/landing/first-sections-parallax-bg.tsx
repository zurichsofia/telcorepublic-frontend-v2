"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { HeroCloudsThree } from "./hero-clouds-three";
import type { HeroParallaxMotion } from "./hero-clouds-three";
import { TvStaticGrain } from "./tv-static-grain";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Horizontal parallax: positive X shifts the plate right as you scroll down, so the viewport reveals
 * more of the right side of the image (within the oversized 130% layer). Capped vw so it scales on large screens.
 */
const SHIFT_X_VW = 6;
const SHIFT_X_MAX_PX = 80;
const SHIFT_Y = 72;
/** Zoom range: starts slightly “in camera” at the top, eases out toward 1 as you scroll (dolly / parallax read). */
const SCALE_START = 1.12;
const SCALE_END = 1;

/** Fade the fixed plate out over the last ~this many viewports before the block ends (smooth handoff to solid bg below). */
const EXIT_FADE_VH = 0.95;

function smoothstep01(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/** Hero + marquee + intro: fixed 100vh scenic camera; scroll-driven zoom + drift; fade at block end. */
export function FirstSectionsParallaxBg({ children }: { children: React.ReactNode; }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fixedShellRef = useRef<HTMLDivElement>(null);
  const parallaxLayerRef = useRef<HTMLDivElement>(null);
  /** Mirrors CSS parallax for the Three.js layer (canvas must not sit under a transformed ancestor). */
  const parallaxMotionRef = useRef<HeroParallaxMotion>({
    x: 0,
    y: 0,
    scale: SCALE_START,
  });
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    const el = rootRef.current;
    const shell = fixedShellRef.current;
    const parallax = parallaxLayerRef.current;
    if (!el || !shell || !parallax) return;

    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight;
    const vh = window.innerHeight;
    const scrollY = window.scrollY;

    const blockEnd = top + h;
    const viewportTop = scrollY;
    const viewportBottom = scrollY + vh;
    const overlapsBlock =
      viewportBottom > top + 0.5 && viewportTop < blockEnd - 0.5;

    const fadeDistance = Math.min(vh * EXIT_FADE_VH, Math.max(0, h - 1));
    let plateOpacity = 0;
    if (overlapsBlock) {
      if (viewportBottom <= blockEnd - fadeDistance) {
        plateOpacity = 1;
      } else {
        const t = clamp((blockEnd - viewportBottom) / fadeDistance, 0, 1);
        plateOpacity = smoothstep01(t);
      }
    }

    let x = 0;
    let y = 0;
    let scale = 1;

    const scrollPast = Math.max(0, scrollY - top);
    const totalScroll = Math.max(1, h - vh);
    const progress = smoothstep01(clamp(scrollPast / totalScroll, 0, 1));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
      const shiftX = Math.min(SHIFT_X_MAX_PX, (window.innerWidth * SHIFT_X_VW) / 100);
      x = progress * shiftX;
      y = -progress * SHIFT_Y;
      scale = SCALE_START + (SCALE_END - SCALE_START) * progress;
    }

    // Higher % = anchor shifts right → more of the right side of the photo stays in frame with the plate drift.
    const objectXPercent = reducedMotion ? 44 : 40 + progress * 18;
    parallax.style.setProperty("--hero-object-x", `${objectXPercent}%`);

    parallax.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
    parallaxMotionRef.current.x = x;
    parallaxMotionRef.current.y = y;
    parallaxMotionRef.current.scale = scale;
    shell.style.opacity = String(plateOpacity);
    shell.style.visibility = plateOpacity > 0.002 ? "visible" : "hidden";
  }, []);

  useLayoutEffect(() => {
    tick();
  }, [tick]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return (
    <div ref={rootRef} className="relative isolate">
      {/* Fixed viewport: always exactly one screen tall — never 200vh / 300vh */}
      <div
        ref={fixedShellRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-svh max-h-svh min-h-0 w-full overflow-hidden"
        style={{ opacity: 1, visibility: "visible" }}
        aria-hidden
      >
        <div className="absolute inset-0">
          <div
            ref={parallaxLayerRef}
            className="absolute left-1/2 top-1/2 h-[130%] w-[130%] will-change-transform transform-[translate3d(-50%,-50%,0)_scale(1.12)] backface-hidden [--hero-object-x:44%]"
          >
            <div className="relative h-full w-full">
              <Image
                // src="/hero-alps.png"
                src="/hero-alps2.jpg"
                alt=""
                fill
                priority
                className="object-cover"
                style={{ objectPosition: "var(--hero-object-x) 42%" }}
                sizes="100vw"
                quality={92}
              />
            </div>
          </div>
          {/* Same geometry as the image plate (130% centered), but no CSS transform — WebGL stays glitch-free. */}
          <div className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2">
            <HeroCloudsThree motionRef={parallaxMotionRef} />
          </div>
          <div
            className="absolute inset-0 bg-linear-to-b from-black/52 via-black/38 to-black/80"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,rgba(255,255,255,0.05),transparent_55%)]"
            aria-hidden
          />
          <TvStaticGrain opacity={0.2} staticAmount={0.94} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col">{children}</div>
    </div>
  );
}
