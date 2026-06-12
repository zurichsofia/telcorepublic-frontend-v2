import { isMobileDevice } from "@/lib/device/is-coarse-pointer";
import {
  getHeroBottomFromPinMetrics,
  getSharedHeroPinMetrics,
} from "@/lib/snow-mountain/hero-pin-metrics";

/** White nav when `#hero` bottom crosses this (scroll down). */
export const NAV_HERO_ENTER_BOTTOM_PX = 80;

/** Overlay nav again when bottom clears this (scroll up; hysteresis band). */
export const NAV_HERO_EXIT_BOTTOM_PX = 168;

function isPastHeroFromBottom(bottom: number, currentlyPast: boolean): boolean {
  if (bottom > NAV_HERO_ENTER_BOTTOM_PX) return false;

  const threshold = currentlyPast
    ? NAV_HERO_EXIT_BOTTOM_PX
    : NAV_HERO_ENTER_BOTTOM_PX;

  return bottom <= threshold;
}

/** Post-hero (white) nav? Shared by landing and `/services/[slug]` via `#hero`. */
export function isPastHeroView(currentlyPast = false): boolean {
  if (isMobileDevice()) {
    const metrics = getSharedHeroPinMetrics();
    if (metrics) {
      const bottom = getHeroBottomFromPinMetrics(metrics);
      if (bottom <= 0) return true;
      return isPastHeroFromBottom(bottom, currentlyPast);
    }
  }

  const hero = document.getElementById("hero");
  if (!hero) return false;

  const { top, bottom } = hero.getBoundingClientRect();

  if (top >= 0) return false;
  if (bottom <= 0) return true;
  return isPastHeroFromBottom(bottom, currentlyPast);
}
