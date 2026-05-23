/** Cubic-bezier easing — matches mont-fort style section transitions. */
export const HERO_SNAP_EASE = [0.45, 0, 0.15, 1] as const;

export function cubicBezierEase(
  [x1, y1, x2, y2]: readonly [number, number, number, number],
  t: number,
): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  let start = 0;
  let end = 1;
  for (let i = 0; i < 12; i++) {
    const mid = (start + end) / 2;
    const x =
      3 * (1 - mid) * (1 - mid) * mid * x1 +
      3 * (1 - mid) * mid * mid * x2 +
      mid * mid * mid;
    if (x < t) start = mid;
    else end = mid;
  }
  const u = (start + end) / 2;
  return (
    3 * (1 - u) * (1 - u) * u * y1 +
    3 * (1 - u) * u * u * y2 +
    u * u * u
  );
}

/** Cinematic scroll mapping — gentle at start/end, steady in the middle. */
export function heroScrollEase(t: number): number {
  return cubicBezierEase([0.25, 0.1, 0.25, 1], t);
}

/** Exponential frame lerp factor (GSAP scrub-style lag). */
export function scrollScrubLerp(deltaSeconds: number, halfLife = 0.14): number {
  return 1 - Math.pow(0.5, deltaSeconds / halfLife);
}
