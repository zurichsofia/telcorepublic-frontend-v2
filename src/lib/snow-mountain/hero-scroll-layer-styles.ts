import { HERO_CAMERA_END_PROGRESS } from "@/components/landing/snow-mountain/hero/snow-mountain-hero-scroll";
import { heroScrollEase } from "@/lib/snow-mountain/snow-mountain-scroll-easing";

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const t = (x - edge0) / (edge1 - edge0);
  return t * t * (3 - 2 * t);
}

/** Map full-section progress to 0–1 over the camera scroll zone only. */
export function getHeroCameraProgress(sectionProgress: number): number {
  if (sectionProgress <= 0) return 0;
  if (sectionProgress >= HERO_CAMERA_END_PROGRESS) return 1;
  return sectionProgress / HERO_CAMERA_END_PROGRESS;
}

export type HeroScrollLayerStyles = {
  primary: { opacity: number; y: number; };
  telco: { opacity: number; y: number; };
  mission: { opacity: number; y: number; };
};

/** Eased 0–1 over the camera scroll zone — matches WebGL camera mapping. */
function getHeroScrollLayerT(sectionProgress: number): number {
  const cameraProgress = getHeroCameraProgress(sectionProgress);
  if (cameraProgress <= 0) return 0;
  if (cameraProgress >= 1) return 1;
  return heroScrollEase(cameraProgress);
}

export function getHeroScrollLayerStyles(sectionProgress: number): HeroScrollLayerStyles {
  const t = getHeroScrollLayerT(sectionProgress);

  const primaryOpacity = 1 - smoothstep(0.19, 0.3, t);
  const primaryY =
    (1 - smoothstep(0, 0.12, t)) * 56 + smoothstep(0.16, 0.3, t) * -36;

  const telcoOpacity =
    smoothstep(0.22, 0.34, t) * (1 - smoothstep(0.42, 0.54, t));
  const telcoY =
    (1 - smoothstep(0.22, 0.38, t)) * 60 + smoothstep(0.38, 0.54, t) * -40;

  const missionIn = smoothstep(0.5, 0.66, t);
  const missionOpacity = missionIn;
  const missionY =
    (1 - smoothstep(0.5, 0.66, t)) * 60 + smoothstep(0.72, 0.92, t) * -32;

  return {
    primary: { opacity: primaryOpacity, y: primaryY },
    telco: { opacity: telcoOpacity, y: telcoY },
    mission: { opacity: missionOpacity, y: missionY },
  };
}

export function getHeroScrollHintOpacity(sectionProgress: number): number {
  const t = getHeroScrollLayerT(sectionProgress);
  if (t <= 0.6) return 1;
  if (t >= 0.82) return 0;
  return 1 - (t - 0.6) / (0.82 - 0.6);
}
