export type HeroPinMetrics = {
  pinStartY: number;
  pinPx: number;
  sectionHeight: number;
  viewportPx: number;
};

let sharedPinMetrics: HeroPinMetrics | null = null;

export function setSharedHeroPinMetrics(metrics: HeroPinMetrics | null): void {
  sharedPinMetrics = metrics;
}

export function getSharedHeroPinMetrics(): HeroPinMetrics | null {
  return sharedPinMetrics;
}

function getScrollY(): number {
  if (typeof window === "undefined") return 0;
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function readHeroPinProgress(metrics: HeroPinMetrics): number {
  const scrollY = getScrollY();
  if (scrollY <= metrics.pinStartY) return 0;
  const progress = (scrollY - metrics.pinStartY) / metrics.pinPx;
  if (progress >= 1) return 1;
  if (progress <= 0) return 0;
  return progress;
}

export function getHeroBottomFromPinMetrics(metrics: HeroPinMetrics): number {
  return metrics.pinStartY + metrics.sectionHeight - getScrollY();
}
