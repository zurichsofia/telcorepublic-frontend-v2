import { getHeroCameraProgress } from "@/lib/snow-mountain/hero-scroll-layer-styles";
import { heroCloudLiftFactor } from "@/lib/snow-mountain/snow-mountain-cloud-scroll";

/**
 * Progress (0–1) over the hero pin distance — 0 when the section top hits the
 * viewport top, 1 when the sticky pin ends (not the extra release runway).
 */
export function readHeroScrollProgress(section: HTMLElement | null): number {
  if (!section || typeof window === "undefined") return 0;

  const { top, height } = section.getBoundingClientRect();
  const vh = window.innerHeight;
  if (height <= vh) return 0;
  if (top >= vh) return 0;
  if (top + height <= 0) return 1;

  const pinPx = height - vh;
  return Math.min(1, Math.max(0, -top / pinPx));
}

/** Camera orbit progress — linear for smooth scroll up/down. */
export function mapHeroScrollProgress(sectionProgress: number): number {
  return getHeroCameraProgress(sectionProgress);
}

const CROSSFADE_END = 1 / 3;

export function heroPrimaryParallaxY(progress: number): number {
  const t = mapHeroScrollProgress(progress);
  if (t <= 0) return 0;
  if (t >= CROSSFADE_END) return -44;
  const u = t / CROSSFADE_END;
  return -44 * (1 - (1 - u) * (1 - u));
}

export function heroPrimaryParallaxX(progress: number): number {
  const t = mapHeroScrollProgress(progress);
  if (t <= 0) return 0;
  if (t >= CROSSFADE_END) return 12;
  const u = t / CROSSFADE_END;
  return 12 * (1 - (1 - u) * (1 - u));
}

/** Cloud band vertical slide (px) at lift factor 1 — reversible on scroll up/down. */
export const HERO_CLOUD_SCROLL_SLIDE_PX = 90;

export function heroCloudParallaxY(progress: number): number {
  const t = mapHeroScrollProgress(progress);
  if (t <= 0) return 0;
  return -heroCloudLiftFactor(t) * HERO_CLOUD_SCROLL_SLIDE_PX;
}
