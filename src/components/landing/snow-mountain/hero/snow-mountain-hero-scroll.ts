/** Mountain camera orbit + copy sequence — one viewport per copy beat (3 × 100vh). */
export const HERO_CAMERA_SCROLL_VH = 300;

/** Pinned hold — “Our Mission” stays on screen, camera frozen at final pose. */
export const HERO_MISSION_HOLD_VH = 56;

/** Scroll distance while the sticky canvas stays pinned. */
export const HERO_STICKY_SCROLL_VH =
  HERO_CAMERA_SCROLL_VH + HERO_MISSION_HOLD_VH;

/** Extra section height so sticky stays pinned for the full sticky scroll distance. */
export const HERO_RELEASE_SCROLL_VH = 100;

/** Total hero `<section>` height — pinned scroll + viewport for sticky release. */
export const HERO_SECTION_VH = HERO_STICKY_SCROLL_VH + HERO_RELEASE_SCROLL_VH;

/** Section progress where camera motion completes. */
export const HERO_CAMERA_END_PROGRESS =
  HERO_CAMERA_SCROLL_VH / HERO_SECTION_VH;
