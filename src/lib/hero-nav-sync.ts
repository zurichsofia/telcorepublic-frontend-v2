/** Nav switches when Why Us white surface reaches this viewport offset (px). */
export const NAV_MOUNTAIN_EXIT_TOP_PX = 80;

export function isPastMountainView(
  navOffsetPx = NAV_MOUNTAIN_EXIT_TOP_PX,
): boolean {
  const screen = document.getElementById("why-us-first-screen");
  if (!screen) return false;
  return screen.getBoundingClientRect().top <= navOffsetPx;
}
