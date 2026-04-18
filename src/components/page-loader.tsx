"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

import { BrandLogoSignal } from "@/components/brand-logo-signal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { isSceneRegistered, waitForScene } from "@/lib/scene-ready";

/** Minimum time the loader stays visible so it does not feel like a glitch. */
const MIN_MS = 720;
/** Safety cap if load/fonts hang. */
const MAX_MS = 8000;

export function PageLoader() {
  const [phase, setPhase] = useState<"loading" | "exit" | "gone">("loading");
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const exitTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const scheduleExit = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setPhase("exit");
      }, wait);
    };

    const waitForReady = async () => {
      try {
        const deps: Promise<unknown>[] = [
          document.fonts.ready,
          new Promise<void>((resolve) => {
            if (document.readyState === "complete") resolve();
            else window.addEventListener("load", () => resolve(), { once: true });
          }),
        ];
        if (isSceneRegistered()) {
          deps.push(waitForScene());
        }
        await Promise.all(deps);
      } catch {
        /* ignore */
      }
      scheduleExit();
    };

    void waitForReady();

    const maxTimer = window.setTimeout(() => {
      if (!cancelled) setPhase((p) => (p === "loading" ? "exit" : p));
    }, MAX_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || phase !== "exit") return;

    exitTweenRef.current?.kill();

    let finished = false;
    const exitDuration = reduce ? 0.2 : 0.75;
    exitTweenRef.current = gsap.to(el, {
      opacity: 0,
      duration: exitDuration,
      ease: "power3.out",
      onComplete: () => {
        if (!finished) {
          finished = true;
          setPhase("gone");
        }
      },
    });

    return () => {
      finished = true;
      exitTweenRef.current?.kill();
      exitTweenRef.current = null;
    };
  }, [phase, reduce]);

  if (phase === "gone") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#b6bfc7" }}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label="Loading"
    >
      <div className="flex flex-col items-center text-center">
        <BrandLogoSignal priority />

        <div className="relative mt-10 h-[2px] w-[min(12rem,70vw)] overflow-hidden rounded-full">
          {!reduce && (
            <span
              className="page-loader-shimmer absolute inset-y-0 w-1/3 rounded-full bg-linear-to-r from-transparent via-[rgba(58,52,68,0.42)] to-transparent"
              aria-hidden
            />
          )}
          {reduce && (
            <span
              className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(58,52,68,0.42)] to-transparent opacity-80"
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );
}
