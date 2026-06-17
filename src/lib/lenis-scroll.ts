/** Lenis-interpolated scrollY — read from RAF loops (WebGL, etc.) for jitter-free parallax. */
let smoothScrollY = 0;
let lenisActive = false;

const scrollSubscribers = new Set<() => void>();
let notifyRafId = 0;

/** True while the user is actively wheeling/touching — not Lenis lerp tail-off. */
let userScrollIntentUntil = 0;

const USER_SCROLL_INTENT_MS = 220;

function notifySubscribers(): void {
  if (notifyRafId !== 0) return;
  notifyRafId = requestAnimationFrame(() => {
    notifyRafId = 0;
    scrollSubscribers.forEach((listener) => listener());
  });
}

/** Mark active user input — call on wheel/touch or high Lenis velocity. */
export function markUserScrollIntent(durationMs = USER_SCROLL_INTENT_MS): void {
  userScrollIntentUntil = performance.now() + durationMs;
}

export function isUserScrollIntentActive(): boolean {
  return performance.now() < userScrollIntentUntil;
}

export function setLenisScrollY(y: number): void {
  smoothScrollY = y;
  lenisActive = true;
  notifySubscribers();
}

export function resetLenisScrollY(): void {
  smoothScrollY = 0;
  lenisActive = false;
  userScrollIntentUntil = 0;
  if (notifyRafId !== 0) {
    cancelAnimationFrame(notifyRafId);
    notifyRafId = 0;
  }
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
