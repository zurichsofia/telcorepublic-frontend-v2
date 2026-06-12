"use client";

import { useSyncExternalStore } from "react";

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
  const mobile = useSyncExternalStore(
    subscribeNoop,
    getMobileHeroSnapshot,
    () => false,
  );

  if (mobile) return <SnowMountainHeroMobile />;
  return <SnowMountainHeroDesktop />;
}
