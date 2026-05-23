/** Scroll distance (vh) while the mountain canvas is pinned. */
export const HERO_STICKY_SCROLL_VH = 400;
/** Total hero `<section>` height (vh). */
export const HERO_SECTION_VH = HERO_STICKY_SCROLL_VH + 100;

/** Progress where the sticky layer releases — start snapping from here. */
export const HERO_EXIT_SNAP_START = HERO_STICKY_SCROLL_VH / HERO_SECTION_VH;

/** Scroll target when snapping back into the hero. */
export const HERO_SNAP_BACK_PROGRESS = HERO_EXIT_SNAP_START - 0.02;

/** Minimum hero peek (ratio of viewport) before an upward snap fires. */
export const HERO_PEEK_SNAP_RATIO = 0.05;
