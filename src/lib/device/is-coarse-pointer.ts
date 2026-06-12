/** True for touch-primary devices (phones, most tablets). */
export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/** Phones and narrow viewports — native scroll, no Lenis. */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    isCoarsePointer() || window.matchMedia("(max-width: 768px)").matches
  );
}

/**
 * Shared boot / loader fail-forward deadline.
 * Mobile needs longer — Draco decode and shader compile can block the main thread.
 */
export function getSceneBootTimeoutMs(): number {
  if (typeof window === "undefined") return 12_000;
  const mobile =
    isCoarsePointer() || window.matchMedia("(max-width: 768px)").matches;
  return mobile ? 25_000 : 12_000;
}
