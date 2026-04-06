/**
 * Maps overall hero scroll progress (0 = top, 1 = hero ends) to a 0–1 curve
 * for *minimal* perspective motion only in the middle third:
 *   [0, ⅓)   → 0   (first 100vh: stable)
 *   [⅓, ⅔]   → 0→1 (second 100vh: subtle motion, smoothstep)
 *   (⅔, 1]   → 1   (last 100vh: hold + HTML handoff)
 */
export function heroSubtleMotionT(progress: number): number {
  const a = 1 / 3;
  const b = 2 / 3;
  if (progress <= a) return 0;
  if (progress >= b) return 1;
  const u = (progress - a) / (b - a);
  return u * u * (3 - 2 * u);
}
