/**
 * Locked viewport units — same approach as mont-fort.com.
 *
 * Safari's URL bar changes `innerHeight` / `dvh` but `documentElement.clientHeight`
 * (layout viewport) stays stable. JS writes `--svh` in px; layout uses
 * `calc(N * var(--svh))` instead of native `svh`/`dvh` units.
 *
 * @see https://mont-fort.com/
 */

export function syncViewportCssVars(): number {
  const root = document.documentElement;
  const heightPx = root.clientHeight;
  const unit = `${heightPx * 0.01}px`;
  root.style.setProperty("--svh", unit);
  return heightPx;
}

/** Stable layout viewport height in px (from locked `--svh` when set). */
export function getStableViewportPx(): number {
  if (typeof window === "undefined") return 0;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--svh")
    .trim();
  if (raw.endsWith("px")) {
    return parseFloat(raw) * 100;
  }

  return document.documentElement.clientHeight;
}

/** CSS length for one full stable mobile viewport. */
export const MOBILE_VIEWPORT_HEIGHT = "calc(100 * var(--svh))";

/** CSS length for hero section scroll track on mobile. */
export function mobileHeroSectionHeight(sectionVh: number): string {
  return `calc(${sectionVh} * var(--svh))`;
}
