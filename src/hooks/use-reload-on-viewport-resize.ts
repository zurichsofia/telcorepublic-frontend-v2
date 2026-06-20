"use client";

import { useEffect } from "react";

import { isMobileDevice } from "@/lib/device/is-coarse-pointer";

type ViewportSize = { width: number; height: number };

function readViewportSize(): ViewportSize {
  const vv = window.visualViewport;
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
  };
}

function viewportJumped(
  prev: ViewportSize,
  next: ViewportSize,
  threshold: number,
  /** On touch devices, height-only jumps are usually the URL bar — not a broken hero. */
  mobile: boolean,
): boolean {
  const widthJumped = Math.abs(next.width - prev.width) > threshold;
  if (mobile) return widthJumped;
  return (
    widthJumped || Math.abs(next.height - prev.height) > threshold
  );
}

type UseReloadOnViewportResizeOptions = {
  /** Ignore small changes (e.g. mobile browser chrome). */
  threshold?: number;
  /** Wait until resize settles before reloading. */
  debounceMs?: number;
  /** Skip reloads until after initial hero load. */
  armDelayMs?: number;
};

/** Hard-reset the page when the viewport changes enough to break the WebGL hero. */
export function useReloadOnViewportResize({
  threshold = 48,
  debounceMs = 250,
  armDelayMs = 800,
}: UseReloadOnViewportResizeOptions = {}): void {
  useEffect(() => {
    let armed = false;
    let debounce = 0;
    let baseline = readViewportSize();

    const armTimer = window.setTimeout(() => {
      armed = true;
      baseline = readViewportSize();
    }, armDelayMs);

    const maybeReload = () => {
      if (!armed) return;

      const mobile = isMobileDevice();
      const next = readViewportSize();
      if (!viewportJumped(baseline, next, threshold, mobile)) {
        // Address-bar collapse/expand only shifts height on mobile — keep baseline in sync.
        if (mobile && Math.abs(next.width - baseline.width) <= threshold) {
          baseline = next;
        }
        return;
      }

      window.location.reload();
    };

    const schedule = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(maybeReload, debounceMs);
    };

    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    window.visualViewport?.addEventListener("resize", schedule);

    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(debounce);
      window.clearTimeout(armTimer);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [threshold, debounceMs, armDelayMs]);
}
