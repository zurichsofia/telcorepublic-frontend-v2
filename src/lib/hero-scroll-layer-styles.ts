function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const t = (x - edge0) / (edge1 - edge0);
  return t * t * (3 - 2 * t);
}

export type HeroScrollLayerStyles = {
  primary: { opacity: number; y: number };
  telco: { opacity: number; y: number };
  mission: { opacity: number; y: number };
};

export function getHeroScrollLayerStyles(t: number): HeroScrollLayerStyles {
  const primaryOpacity = 1 - smoothstep(0.19, 0.3, t);
  const primaryY =
    (1 - smoothstep(0, 0.12, t)) * 56 + smoothstep(0.16, 0.3, t) * -36;

  const telcoOpacity =
    smoothstep(0.22, 0.34, t) * (1 - smoothstep(0.42, 0.54, t));
  const telcoY =
    (1 - smoothstep(0.22, 0.38, t)) * 60 + smoothstep(0.38, 0.54, t) * -40;

  const missionOpacity =
    smoothstep(0.4, 0.52, t) * (1 - smoothstep(0.82, 0.94, t));
  const missionY =
    (1 - smoothstep(0.5, 0.55, t)) * 60 + smoothstep(0.5, 0.78, t) * -32;

  return {
    primary: { opacity: primaryOpacity, y: primaryY },
    telco: { opacity: telcoOpacity, y: telcoY },
    mission: { opacity: missionOpacity, y: missionY },
  };
}

export function getHeroScrollHintOpacity(t: number): number {
  if (t <= 0.65) return 1;
  if (t >= 0.88) return 0;
  return 1 - (t - 0.65) / (0.88 - 0.65);
}
