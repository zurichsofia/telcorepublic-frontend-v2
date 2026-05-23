import { useSyncExternalStore } from "react";

/** Imperative scroll progress — updated from Lenis / layout reads, consumed by WebGL and React. */
export type ScrollProgressStore = {
  get: () => number;
  set: (value: number) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createScrollProgressStore(initial = 0): ScrollProgressStore {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next) => {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useScrollProgress(store: ScrollProgressStore): number {
  return useSyncExternalStore(store.subscribe, store.get, () => 0);
}

/** Minimal read surface for components that poll progress each frame (e.g. R3F). */
export type HeroProgressRead = {
  get: () => number;
};
