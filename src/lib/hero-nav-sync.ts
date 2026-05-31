/** Nav switches to light surface when a post-hero section crosses this line (scroll down). */
export const NAV_MOUNTAIN_ENTER_TOP_PX = 80;

/** Nav returns to hero overlay when sections fall below this line (scroll up). */
export const NAV_MOUNTAIN_EXIT_TOP_PX = 168;

const LIGHT_SECTION_IDS = ["global-reach", "why-us-first-screen"] as const;

/**
 * Whether the primary nav should use the post-hero (light) treatment.
 * Hysteresis avoids a flip-flop / scroll “snap” feel at the hero boundary.
 */
export function isPastMountainView(currentlyPast = false): boolean {
  const threshold = currentlyPast
    ? NAV_MOUNTAIN_EXIT_TOP_PX
    : NAV_MOUNTAIN_ENTER_TOP_PX;

  for (const id of LIGHT_SECTION_IDS) {
    const screen = document.getElementById(id);
    if (!screen) continue;
    if (screen.getBoundingClientRect().top <= threshold) return true;
  }
  return false;
}
