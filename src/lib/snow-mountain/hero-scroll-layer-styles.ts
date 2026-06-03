import { HERO_CAMERA_END_PROGRESS } from "@/components/landing/snow-mountain/hero/snow-mountain-hero-scroll";

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const t = (x - edge0) / (edge1 - edge0);
  return t * t * (3 - 2 * t);
}

/**
 * Quintic ease (6t⁵ − 15t⁴ + 10t³): zero velocity *and* zero acceleration at
 * both edges, so beat transitions ease in/out far more gently than smoothstep.
 */
function smootherstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const t = (x - edge0) / (edge1 - edge0);
  return t * t * t * (t * (t * 6 - 15) + 10);
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
/** Transition width at section boundaries (linear camera progress). Wider = gentler. */
const HERO_COPY_CROSSFADE = 0.13;

export type HeroScrollLayerStyles = {
  primary: { opacity: number; y: number; };
  telco: { opacity: number; y: number; };
  mission: { opacity: number; y: number; };
};

function getHeroScrollLayerT(sectionProgress: number): number {
  return getHeroCameraProgress(sectionProgress);
}

export function getHeroScrollLayerStyles(sectionProgress: number): HeroScrollLayerStyles {
  const t = getHeroScrollLayerT(sectionProgress);
  const fade = HERO_COPY_CROSSFADE;
  const slide = 28;

  // Beat 1 (primary): visible from the top, fades + lifts out by the S1 boundary.
  const primaryOut = smootherstep(HERO_COPY_S1_END - fade, HERO_COPY_S1_END, t);
  const primaryOpacity = 1 - primaryOut;
  const primaryY = primaryOut * -slide;

  // Beat 2 (telco): enters only *after* beat 1 has fully left, exits before beat 3.
  const telcoIn = smootherstep(HERO_COPY_S1_END, HERO_COPY_S1_END + fade, t);
  const telcoOut = smootherstep(HERO_COPY_S2_END - fade, HERO_COPY_S2_END, t);
  const telcoOpacity = telcoIn * (1 - telcoOut);
  const telcoY = (1 - telcoIn) * slide + telcoOut * -slide;

  // Beat 3 (mission): enters only after beat 2 has fully left.
  const missionIn = smootherstep(HERO_COPY_S2_END, HERO_COPY_S2_END + fade, t);
  const missionOpacity = missionIn;
  const missionY = (1 - missionIn) * slide;

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
