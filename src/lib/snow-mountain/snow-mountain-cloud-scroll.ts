function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const u = (x - edge0) / (edge1 - edge0);
  return u * u * (3 - 2 * u);
}

/**
 * Normalized cloud lift (0–1) over hero camera progress. Eases in/out at the
 * ends so the band lifts slightly and reverses smoothly on scroll up.
 */
export function heroCloudLiftFactor(cameraT: number): number {
  const t = Math.min(1, Math.max(0, cameraT));
  return smoothstep(0, 1, t);
}
