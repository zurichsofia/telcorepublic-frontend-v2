import { getHeroCameraProgress } from "@/lib/snow-mountain/hero-scroll-layer-styles";
import { heroScrollEase } from "@/lib/snow-mountain/snow-mountain-scroll-easing";

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

/** Same progress as {@link readHeroScrollProgress} without forcing layout (Lenis scrollY). */
export function readHeroScrollProgressFromScrollY(
  scrollY: number,
  heroOffsetTop: number,
  heroHeight: number,
): number {
  if (heroHeight <= 0) return 0;
  return Math.min(1, Math.max(0, (scrollY - heroOffsetTop) / heroHeight));
}

/** End of primary headline motion (first copy beat — matches layer section 1). */
const CROSSFADE_END = 1 / 3;

/** Map section progress to eased cinematic progress (camera + parallax). */
export function mapHeroScrollProgress(sectionProgress: number): number {
  const cameraProgress = getHeroCameraProgress(sectionProgress);
  if (cameraProgress <= 0) return 0;
  if (cameraProgress >= 1) return 1;
  return heroScrollEase(cameraProgress);
}

/** Primary hero copy: vertical drift (px) for WebGL cloud parallax. */
export function heroPrimaryParallaxY(sectionProgress: number): number {
  const eased = mapHeroScrollProgress(sectionProgress);
  if (eased <= 0) return 0;
  if (eased >= CROSSFADE_END) return -44;
  const t = eased / CROSSFADE_END;
  const ease = 1 - (1 - t) * (1 - t);
  return -44 * ease;
}

/** Horizontal nudge (px) for cloud parallax. */
export function heroPrimaryParallaxX(sectionProgress: number): number {
  const eased = mapHeroScrollProgress(sectionProgress);
  if (eased <= 0) return 0;
  if (eased >= CROSSFADE_END) return 12;
  const t = eased / CROSSFADE_END;
  const ease = 1 - (1 - t) * (1 - t);
  return 12 * ease;
}
