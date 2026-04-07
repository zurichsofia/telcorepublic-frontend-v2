function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const t = (x - edge0) / (edge1 - edge0);
  return t * t * (3 - 2 * t);
}

/**
 * Maps overall hero scroll progress (0 = top, 1 = hero ends) to a 0–1 curve for
 * subtle 3D motion. Ramps from the first pixel of scroll (non-zero slope at 0 so
 * it never feels “stuck”); reaches full strength by ~⅔, then holds for handoff.
 */
export function heroSubtleMotionT(progress: number): number {
  const holdFrom = 2 / 3;
  if (progress <= 0) return 0;
  if (progress >= holdFrom) return 1;
  const u = progress / holdFrom;
  /* Quadratic ease-out: visible motion immediately (unlike smoothstep at 0). */
  return 1 - (1 - u) * (1 - u);
}

/**
 * Full hero scroll (0 → 1) mapped to 0 → 1 with smooth ends — used for camera zoom-out
 * so the effect is felt across the whole section, not only the first ~⅔ like `heroSubtleMotionT`.
 */
export function heroScrollZoomT(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  return smoothstep(0, 1, progress);
}

/** Primary headline visible for the first ~⅓ of hero scroll; crossfade overlaps motion ramp. */
const PHASE_A = 1 / 3;
/** End of primary → mid crossfade (middle of motion ramp). */
const CROSSFADE_END = 0.42;
const MID_HOLD_END = 2 / 3;
/** Mid copy out before full handoff overlay. */
const MID_FADE_END = 0.72;

/**
 * Primary hero headline block: full opacity in first phase, smooth crossfade into mid copy.
 */
export function heroPrimaryCopyOpacity(progress: number): number {
  if (progress <= PHASE_A) return 1;
  if (progress >= CROSSFADE_END) return 0;
  return 1 - smoothstep(PHASE_A, CROSSFADE_END, progress);
}

/**
 * Secondary hero copy: enters as motion ramps, holds through middle, fades before HTML section.
 */
export function heroMidCopyOpacity(progress: number): number {
  if (progress <= PHASE_A) return 0;
  if (progress < CROSSFADE_END) return smoothstep(PHASE_A, CROSSFADE_END, progress);
  if (progress <= MID_HOLD_END) return 1;
  if (progress >= MID_FADE_END) return 0;
  return 1 - smoothstep(MID_HOLD_END, MID_FADE_END, progress);
}

/** Scroll hint + affordances: visible until mid copy fades, then eases out with handoff. */
export function heroScrollHintOpacity(progress: number): number {
  if (progress <= MID_HOLD_END) return 1;
  if (progress >= MID_FADE_END) return 0;
  return 1 - smoothstep(MID_HOLD_END, MID_FADE_END, progress);
}

const HANDOFF_START = 0.66;
const HANDOFF_END = 0.97;

/** Frost wash into the next section (matches `--bg`); overlaps slightly with mid copy tail. */
export function heroHandoffOverlayOpacity(progress: number): number {
  if (progress <= HANDOFF_START) return 0;
  if (progress >= HANDOFF_END) return 1;
  return smoothstep(HANDOFF_START, HANDOFF_END, progress);
}

/** Primary hero copy: vertical drift (px), ties scroll to headline before crossfade. */
export function heroPrimaryParallaxY(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= CROSSFADE_END) return -44;
  const t = progress / CROSSFADE_END;
  const ease = 1 - (1 - t) * (1 - t);
  return -44 * ease;
}

/** Horizontal nudge (px) - mirrors light camera yaw so type moves with the frame. */
export function heroPrimaryParallaxX(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= CROSSFADE_END) return 12;
  const t = progress / CROSSFADE_END;
  const ease = 1 - (1 - t) * (1 - t);
  return 12 * ease;
}

/** Subcopy + CTAs: slightly stronger lift than block average (nested parallax). */
export function heroPrimarySubcopyY(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= CROSSFADE_END) return -14;
  const t = progress / CROSSFADE_END;
  return -14 * (1 - (1 - t) * (1 - t));
}

/** H1 line stagger (0 = first line, 1 = gradient line). */
export function heroPrimaryHeadlineLineY(progress: number, lineIndex: number): number {
  const max = lineIndex === 0 ? -8 : -14;
  if (progress <= 0) return 0;
  if (progress >= CROSSFADE_END) return max;
  const t = progress / CROSSFADE_END;
  const ease = 1 - (1 - t) * (1 - t);
  return max * ease;
}

/** Mid hero block: rises into frame as it appears. */
export function heroMidBlockY(progress: number): number {
  if (progress <= PHASE_A) return 16;
  if (progress >= CROSSFADE_END + 0.03) return 0;
  return 16 * (1 - smoothstep(PHASE_A, CROSSFADE_END, progress));
}

/** Staggered lines inside mid block (0 = label, 1 = title, 2 = body). */
export function heroMidLineY(progress: number, lineIndex: number): number {
  const pad = lineIndex * 0.034;
  const start = PHASE_A + pad;
  const end = CROSSFADE_END + 0.12 + pad * 0.4;
  if (progress <= start) return 10;
  if (progress >= end) return 0;
  return 10 * (1 - smoothstep(start, end, progress));
}
