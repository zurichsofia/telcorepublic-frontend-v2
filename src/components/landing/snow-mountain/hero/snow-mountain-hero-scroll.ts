/** Mountain camera orbit + copy sequence (~160vh per copy beat at 3 beats). */
export const HERO_CAMERA_SCROLL_VH = 480;

/** Extra pinned scroll on the last copy beat before the hero unpins. */
export const HERO_LAST_SECTION_HOLD_VH = 80;

/** Scroll distance while the sticky canvas stays pinned. */
export const HERO_STICKY_SCROLL_VH =
  HERO_CAMERA_SCROLL_VH + HERO_LAST_SECTION_HOLD_VH;

/** Viewport height in the hero section layout (sticky panel height). */
export const HERO_VIEWPORT_VH = 100;

/** Total hero `<section>` height — pin distance + viewport. */
export const HERO_SECTION_VH = HERO_STICKY_SCROLL_VH + HERO_VIEWPORT_VH;

/** Pin progress (0–1) at which camera + copy finish; remainder is hold. */
export const HERO_CAMERA_END_PROGRESS =
  HERO_CAMERA_SCROLL_VH / HERO_STICKY_SCROLL_VH;
