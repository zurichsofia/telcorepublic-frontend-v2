/** Lenis-interpolated scrollY — read from RAF loops (WebGL, etc.) for jitter-free parallax. */
let smoothScrollY = 0;
let lenisActive = false;

export function setLenisScrollY(y: number): void {
  smoothScrollY = y;
  lenisActive = true;
}

export function resetLenisScrollY(): void {
  smoothScrollY = 0;
  lenisActive = false;
}

export function isLenisActive(): boolean {
  return lenisActive;
}

export function getLenisScrollY(): number {
  if (lenisActive) return smoothScrollY;
  if (typeof window === "undefined") return 0;
  return document.documentElement.scrollTop || window.scrollY || 0;
}
