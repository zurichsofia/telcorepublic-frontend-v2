import { HERO_CAMERA_END_PROGRESS } from "@/components/landing/snow-mountain/hero/snow-mountain-hero-scroll";

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

/** Three copy beats — equal linear scroll distance per section. */
const HERO_COPY_SECTIONS = 3;
const HERO_COPY_S1_END = 1 / HERO_COPY_SECTIONS;
const HERO_COPY_S2_END = 2 / HERO_COPY_SECTIONS;
/** Crossfade width at section boundaries (linear camera progress). */
const HERO_COPY_CROSSFADE = 0.07;

export type HeroScrollLayerStyles = {
  primary: { opacity: number; y: number; };
  telco: { opacity: number; y: number; };
  mission: { opacity: number; y: number; };
};

/** Linear 0–1 over the camera zone — equal vh per copy beat (not eased). */
function getHeroScrollLayerT(sectionProgress: number): number {
  return getHeroCameraProgress(sectionProgress);
}

export function getHeroScrollLayerStyles(sectionProgress: number): HeroScrollLayerStyles {
  const t = getHeroScrollLayerT(sectionProgress);
  const fade = HERO_COPY_CROSSFADE;

  const primaryOpacity = 1 - smoothstep(HERO_COPY_S1_END - fade, HERO_COPY_S1_END, t);
  const primaryY =
    (1 - smoothstep(0, HERO_COPY_S1_END * 0.18, t)) * 56 +
    smoothstep(HERO_COPY_S1_END - fade * 0.75, HERO_COPY_S1_END, t) * -36;

  const telcoIn = smoothstep(HERO_COPY_S1_END - fade, HERO_COPY_S1_END, t);
  const telcoOut = smoothstep(HERO_COPY_S2_END - fade, HERO_COPY_S2_END, t);
  const telcoOpacity = telcoIn * (1 - telcoOut);
  const telcoY =
    (1 - smoothstep(HERO_COPY_S1_END - fade, HERO_COPY_S1_END + fade * 0.45, t)) * 60 +
    smoothstep(HERO_COPY_S2_END - fade, HERO_COPY_S2_END, t) * -40;

  const missionIn = smoothstep(HERO_COPY_S2_END - fade, HERO_COPY_S2_END, t);
  const missionOpacity = missionIn;
  const missionY =
    (1 - smoothstep(HERO_COPY_S2_END - fade, HERO_COPY_S2_END, t)) * 60 +
    smoothstep(HERO_COPY_S2_END + (1 - HERO_COPY_S2_END) * 0.55, 1 - 0.04, t) * -32;

  return {
    primary: { opacity: primaryOpacity, y: primaryY },
    telco: { opacity: telcoOpacity, y: telcoY },
    mission: { opacity: missionOpacity, y: missionY },
  };
}

export function getHeroScrollHintOpacity(sectionProgress: number): number {
  const t = getHeroScrollLayerT(sectionProgress);
  const fadeStart = HERO_COPY_S2_END - HERO_COPY_CROSSFADE * 0.5;
  if (t <= fadeStart) return 1;
  if (t >= HERO_COPY_S2_END) return 0;
  return 1 - (t - fadeStart) / (HERO_COPY_S2_END - fadeStart);
}
