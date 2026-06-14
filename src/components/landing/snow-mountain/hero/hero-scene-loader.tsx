"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BrandLogoSignal } from "@/components/common/brand-logo-signal";
import { useLenis } from "@/components/common/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  getSceneBootTimeoutMs,
  isMobileDevice,
} from "@/lib/device/is-coarse-pointer";
import { cn } from "@/lib/utils";

const EXIT_MS = 500;
const REVEAL_DELAY_MS = 280;
/** Minimum time the lockup stays visible after the logo raster appears. */
const LOCKUP_MIN_MS = 720;

type HeroSceneLoaderProps = {
  ready: boolean;
  /** Fires `true` while the loader covers the screen, `false` once it resolves. */
  onActiveChange?: (active: boolean) => void;
};

export function HeroSceneLoader({ ready, onActiveChange }: HeroSceneLoaderProps) {
  const reduce = usePrefersReducedMotion();
  const lenis = useLenis();
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");
  const [logoReady, setLogoReady] = useState(false);
  const logoReadyAt = useRef<number | null>(null);
  const useLenisScroll = lenis != null && !isMobileDevice();

  const handleLogoReady = useCallback(() => {
    logoReadyAt.current = performance.now();
    setLogoReady(true);
  }, []);

  const canReveal = ready && logoReady;

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => setPhase("exiting"), getSceneBootTimeoutMs());
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!canReveal || phase !== "loading") return;

    const sinceLogo = logoReadyAt.current
      ? performance.now() - logoReadyAt.current
      : 0;
    const minAfterLogo = reduce ? 0 : LOCKUP_MIN_MS;
    const hold = Math.max(reduce ? 0 : REVEAL_DELAY_MS, minAfterLogo - sinceLogo);

    const timer = window.setTimeout(() => setPhase("exiting"), hold);
    return () => window.clearTimeout(timer);
  }, [canReveal, phase, reduce]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const duration = reduce ? 120 : EXIT_MS;
    const timer = window.setTimeout(() => setPhase("done"), duration);
    return () => window.clearTimeout(timer);
  }, [phase, reduce]);

  useEffect(() => {
    onActiveChange?.(phase !== "done");
  }, [phase, onActiveChange]);

  useEffect(() => {
    return () => onActiveChange?.(false);
  }, [onActiveChange]);

  useEffect(() => {
    if (phase === "done") return;

    const root = document.scrollingElement ?? document.documentElement;
    const pinScroll = () => {
      if (root.scrollTop !== 0) root.scrollTop = 0;
    };

    pinScroll();

    const blockScrollKeys = new Set([
      " ",
      "ArrowDown",
      "ArrowUp",
      "End",
      "Home",
      "PageDown",
      "PageUp",
    ]);
    const onKeyDown = (event: KeyboardEvent) => {
      if (blockScrollKeys.has(event.key)) event.preventDefault();
    };
    const onWheel = (event: WheelEvent) => {
      if (event.cancelable) event.preventDefault();
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.cancelable) event.preventDefault();
    };

    root.addEventListener("scroll", pinScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      root.removeEventListener("scroll", pinScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [phase]);

  useEffect(() => {
    if (!useLenisScroll) return;
    if (phase === "done") {
      lenis?.start();
    } else {
      lenis?.stop();
    }
  }, [phase, lenis, useLenisScroll]);

  useEffect(() => {
    if (!useLenisScroll) return;
    return () => lenis?.start();
  }, [lenis, useLenisScroll]);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-telco-dark transition-opacity ease-out",
        phase === "exiting" ? "opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: reduce ? "120ms" : `${EXIT_MS}ms` }}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label="Loading"
    >
      <BrandLogoSignal
        priority
        size="compact"
        unoptimized
        onLogoReady={handleLogoReady}
      />
    </div>
  );
}
