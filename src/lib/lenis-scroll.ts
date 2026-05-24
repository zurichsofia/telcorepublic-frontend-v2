/** Lenis-interpolated scrollY — read from RAF loops (WebGL, etc.) for jitter-free parallax. */
let smoothScrollY = 0;
let lenisActive = false;

const scrollSubscribers = new Set<() => void>();

export function setLenisScrollY(y: number): void {
  smoothScrollY = y;
  lenisActive = true;
  scrollSubscribers.forEach((listener) => listener());
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

/** Batched scroll work — one Lenis listener fans out here instead of many `.on("scroll")` hooks. */
export function subscribeLenisScroll(listener: () => void): () => void {
  scrollSubscribers.add(listener);
  return () => scrollSubscribers.delete(listener);
}
