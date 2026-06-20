"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

import { useReloadOnViewportResize } from "@/hooks/use-reload-on-viewport-resize";
import { isMobileDevice } from "@/lib/device/is-coarse-pointer";

const SnowMountainHeroMobile = dynamic(
  () =>
    import("./snow-mountain-hero-mobile").then(
      (module) => module.SnowMountainHeroMobile,
    ),
  { ssr: false },
);

const SnowMountainHeroDesktop = dynamic(
  () =>
    import("./snow-mountain-hero-desktop").then(
      (module) => module.SnowMountainHeroDesktop,
    ),
  { ssr: false },
);

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
