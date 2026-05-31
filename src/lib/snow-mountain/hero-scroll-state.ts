/** Single hero scroll progress — one layout read per frame, many readers. */
export type HeroScrollState = {
  get: () => number;
  set: (value: number) => void;
  subscribe: (listener: () => void) => () => void;
};

const PROGRESS_EPSILON = 1e-5;

export function createHeroScrollState(initial = 0): HeroScrollState {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next) => {
      const clamped = next <= 0 ? 0 : next >= 1 ? 1 : next;
      const changed = Math.abs(clamped - value) >= PROGRESS_EPSILON;
      value = clamped;
      if (changed) listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
