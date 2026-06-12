import { isMobileDevice } from "@/lib/device/is-coarse-pointer";

/** Single hero scroll progress — one writer, many readers. */
export type HeroScrollState = {
  get: () => number;
  set: (value: number) => void;
  subscribe: (listener: () => void) => () => void;
};

const PROGRESS_EPSILON = 1e-5;

export function createHeroScrollState(initial = 0): HeroScrollState {
  let value = initial;
  const listeners = new Set<() => void>();
  const epsilon = isMobileDevice() ? 0 : PROGRESS_EPSILON;

  return {
    get: () => value,
    set: (next) => {
      const clamped = next <= 0 ? 0 : next >= 1 ? 1 : next;
      const changed =
        epsilon === 0
          ? clamped !== value
          : Math.abs(clamped - value) >= epsilon;
      value = clamped;
      if (changed) listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
