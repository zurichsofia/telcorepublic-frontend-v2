import { heroScrollEase } from "@/lib/snow-mountain-scroll-easing";

/**
 * Progress for the hero `<section>`: 0 when its top hits the viewport top, 1 when its bottom does.
 * Used with Lenis — read from layout each scroll frame.
 */
export function readHeroScrollProgress(section: HTMLElement | null): number {
  if (!section) return 0;
  const rect = section.getBoundingClientRect();
  const h = rect.height;
  if (h <= 0) return 0;
  return Math.min(1, Math.max(0, -rect.top / h));
}

/** End of primary headline motion (used for cloud parallax vs scroll). */
const CROSSFADE_END = 0.32;

/** Map raw scroll progress to eased cinematic progress (camera + parallax). */
export function mapHeroScrollProgress(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  return heroScrollEase(progress);
}

/** Primary hero copy: vertical drift (px) for WebGL cloud parallax. */
export function heroPrimaryParallaxY(progress: number): number {
  const eased = mapHeroScrollProgress(progress);
  if (eased <= 0) return 0;
  if (eased >= CROSSFADE_END) return -44;
  const t = eased / CROSSFADE_END;
  const ease = 1 - (1 - t) * (1 - t);
  return -44 * ease;
}

/** Horizontal nudge (px) for cloud parallax. */
export function heroPrimaryParallaxX(progress: number): number {
  const eased = mapHeroScrollProgress(progress);
  if (eased <= 0) return 0;
  if (eased >= CROSSFADE_END) return 12;
  const t = eased / CROSSFADE_END;
  const ease = 1 - (1 - t) * (1 - t);
  return 12 * ease;
}
