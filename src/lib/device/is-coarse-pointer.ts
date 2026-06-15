export const COARSE_POINTER_MQ = "(pointer: coarse)";
export const MOBILE_MAX_WIDTH_MQ = "(max-width: 768px)";

/** True for touch-primary devices (phones, most tablets). */
export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(COARSE_POINTER_MQ).matches;
}

/** Phones and narrow viewports — native scroll, no Lenis. */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    isCoarsePointer() || window.matchMedia(MOBILE_MAX_WIDTH_MQ).matches
  );
}

/**
 * Shared boot / loader fail-forward deadline.
 * Mobile needs longer — Draco decode and shader compile can block the main thread.
 */
export function getSceneBootTimeoutMs(): number {
  if (typeof window === "undefined") return 12_000;
  return isMobileDevice() ? 25_000 : 12_000;
}
