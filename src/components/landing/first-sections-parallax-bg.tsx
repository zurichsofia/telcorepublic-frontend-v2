"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { TvStaticGrain } from "./tv-static-grain";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Max pan (px) inside the 100vh “camera” while scrolling the first block.
 * Zoom + drift are driven from the full block scroll (not delayed) so motion is obvious from the first pixel.
 */
const SHIFT_X = 48;
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
  const rafRef = useRef<number>(0);
  const [layer, setLayer] = useState({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  });

  const tick = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLayer({ x: 0, y: 0, scale: 1, opacity: plateOpacity });
      return;
    }

    // 0 → 1 over the whole scroll range through this block (parallax + zoom visible immediately)
    const scrollPast = Math.max(0, scrollY - top);
    const totalScroll = Math.max(1, h - vh);
    const progress = smoothstep01(clamp(scrollPast / totalScroll, 0, 1));

    setLayer({
      x: progress * SHIFT_X,
      y: -progress * SHIFT_Y,
      scale: SCALE_START + (SCALE_END - SCALE_START) * progress,
      opacity: plateOpacity,
    });
  }, []);

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
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-svh max-h-svh min-h-0 w-full overflow-hidden"
        style={{
          opacity: layer.opacity,
          visibility: layer.opacity > 0.002 ? "visible" : "hidden",
        }}
        aria-hidden
      >
        <div className="absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[130%] w-[130%] will-change-transform"
            style={{
              transform: `translate3d(calc(-50% + ${layer.x}px), calc(-50% + ${layer.y}px), 0) scale(${layer.scale})`,
            }}
          >
            <div className="relative h-full w-full">
              <Image
                // src="/hero-alps.png"
                src="/hero-alps2.jpg"
                alt=""
                fill
                priority
                className="object-cover object-[44%_42%]"
                sizes="100vw"
                quality={92}
              />
            </div>
          </div>
          <div
            className="absolute inset-0 bg-linear-to-b from-black/52 via-black/38 to-black/80"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_40%,rgba(255,255,255,0.06),transparent_55%)]"
            aria-hidden
          />
          <TvStaticGrain opacity={0.2} staticAmount={0.94} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col">{children}</div>
    </div>
  );
}
