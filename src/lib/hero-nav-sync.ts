/** Nav switches when a light post-hero section reaches this viewport offset (px). */
export const NAV_MOUNTAIN_EXIT_TOP_PX = 80;

const LIGHT_SECTION_IDS = ["global-reach", "why-us-first-screen"] as const;

export function isPastMountainView(
  navOffsetPx = NAV_MOUNTAIN_EXIT_TOP_PX,
): boolean {
  for (const id of LIGHT_SECTION_IDS) {
    const screen = document.getElementById(id);
    if (!screen) continue;
    if (screen.getBoundingClientRect().top <= navOffsetPx) return true;
  }
  return false;
}
