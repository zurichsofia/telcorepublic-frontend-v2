"use client";

import { useSyncExternalStore } from "react";

import { useReloadOnViewportResize } from "@/hooks/use-reload-on-viewport-resize";
import { isMobileDevice } from "@/lib/device/is-coarse-pointer";

import { SnowMountainHeroDesktop } from "./snow-mountain-hero-desktop";
import { SnowMountainHeroMobile } from "./snow-mountain-hero-mobile";

function subscribeNoop() {
  return () => {};
}

function getMobileHeroSnapshot() {
  return isMobileDevice();
}

export function SnowMountainHero() {
  useReloadOnViewportResize();

  const mobile = useSyncExternalStore(
    subscribeNoop,
    getMobileHeroSnapshot,
    () => false,
  );

  if (mobile) return <SnowMountainHeroMobile />;
  return <SnowMountainHeroDesktop />;
}
