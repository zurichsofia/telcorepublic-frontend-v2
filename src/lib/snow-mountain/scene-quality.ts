import { isCoarsePointer } from "@/lib/device/is-coarse-pointer";

export type SceneQuality = "desktop" | "mobile" | "low";

/** Runtime rendering tier — desktop path unchanged when quality is `desktop`. */
export function getSceneQuality(): SceneQuality {
  if (typeof window === "undefined") return "desktop";

  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const coarse = isCoarsePointer();

  if (!coarse && !narrow) return "desktop";

  // iOS often reports deviceMemory as undefined and hardwareConcurrency as 4 —
  // avoid downgrading modern phones to the low tier.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory != null && memory <= 2) {
    return "low";
  }

  return "mobile";
}

export function getScenePixelRatio(quality: SceneQuality): number {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  if (quality === "low") return Math.min(dpr, 1.25);
  return Math.min(dpr, 2);
}

export function getCanvasDprRange(quality: SceneQuality): [number, number] {
  const max = getScenePixelRatio(quality);
  return [1, max];
}
