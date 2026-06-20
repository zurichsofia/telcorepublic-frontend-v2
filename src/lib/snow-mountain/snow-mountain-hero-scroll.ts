import { getHeroCameraProgress } from "@/lib/snow-mountain/hero-scroll-layer-styles";

/**
 * Progress (0–1) over the hero pin distance — 0 when the section top hits the
 * viewport top, 1 when the sticky pin ends (not the extra release runway).
 */
export function readHeroScrollProgress(
  section: HTMLElement | null,
  /** Lock on mobile so URL-bar collapse doesn't compress beat pacing mid-scroll. */
  lockedViewportPx?: number,
): number {
  if (!section || typeof window === "undefined") return 0;

  const { top, height } = section.getBoundingClientRect();
  const vh = lockedViewportPx ?? window.innerHeight;
  if (height <= vh) return 0;
  if (top >= vh) return 0;
  if (top + height <= 0) return 1;

  const pinPx = height - vh;
  return Math.min(1, Math.max(0, -top / pinPx));
}

/**
 * Lags the 3D camera / copy behind layout scroll so fast wheel flicks do not
 * whip through orbit beats. Lenis smooths page scroll; this smooths hero progress.
 */
export const HERO_CAMERA_PROGRESS_DAMPING = 1;

/** Native touch scroll — light follow so beats/camera stay smooth between samples. */
export const MOBILE_HERO_CAMERA_PROGRESS_DAMPING = 30;

const PROGRESS_SNAP_EPSILON = 1e-4;

export function dampHeroScrollProgress(
  current: number,
  target: number,
  deltaSeconds: number,
  damping = HERO_CAMERA_PROGRESS_DAMPING,
): number {
  const clampedTarget = Math.min(1, Math.max(0, target));
  if (Math.abs(clampedTarget - current) < PROGRESS_SNAP_EPSILON) {
    return clampedTarget;
  }

  const dt = Math.min(Math.max(deltaSeconds, 0), 0.1);
  const alpha = 1 - Math.exp(-damping * dt);
  const next = current + (clampedTarget - current) * alpha;
  return Math.min(1, Math.max(0, next));
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
