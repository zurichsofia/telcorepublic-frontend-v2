"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { HeroCloudsThree } from "./hero-clouds-three";
import type { HeroParallaxMotion } from "./hero-clouds-three";
import { TvStaticGrain } from "./tv-static-grain";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Initial scale for the hero image plate (matches CSS transform on the layer). */
const SCALE_START = 1.12;

/**
 * Fade the fixed plate out over the last portion of the block (distance from viewport top to the block’s
 * bottom edge). Larger = longer, gentler ramp before the solid sections below.
 */
const EXIT_FADE_VH = 0.55;

function smoothstep01(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/** Hero + statement: fixed 100vh scenic camera; only visible while this block intersects the viewport. */
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

  const [bgOpacity, setBgOpacity] = useState(1);

  const updateBgOpacity = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const t = rect.top;
    const b = rect.bottom;

    if (t >= vh || b <= 0) {
      setBgOpacity(0);
      return;
    }

    const fadePx = vh * EXIT_FADE_VH;
    if (b >= fadePx) {
      setBgOpacity(1);
      return;
    }

    setBgOpacity(smoothstep01(b / fadePx));
  }, []);

  useLayoutEffect(() => {
    updateBgOpacity();
  }, [updateBgOpacity]);

  useEffect(() => {
    updateBgOpacity();
    window.addEventListener("scroll", updateBgOpacity, { passive: true });
    window.addEventListener("resize", updateBgOpacity);
    return () => {
      window.removeEventListener("scroll", updateBgOpacity);
      window.removeEventListener("resize", updateBgOpacity);
    };
  }, [updateBgOpacity]);

  return (
    <div ref={rootRef} className="relative isolate">
      {/* Fixed viewport: exactly one screen tall — does not extend with page length */}
      <div
        ref={fixedShellRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-screen max-h-screen min-h-0 w-full overflow-hidden"
        style={{ opacity: bgOpacity }}
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
                className="object-cover brightness-[0.97] contrast-[1.03] saturate-[1.06]"
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
          {/* Neutral dark grade — matches black-base + cool mist (reference site) */}
          <div
            className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-transparent to-slate-900/18 mix-blend-soft-light"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-black/90"
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
