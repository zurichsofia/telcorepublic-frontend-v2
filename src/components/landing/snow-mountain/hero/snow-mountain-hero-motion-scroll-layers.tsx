"use client";

import { useEffect, useRef } from "react";

import { getHeroScrollLayerStyles } from "@/lib/snow-mountain/hero-scroll-layer-styles";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import { cn } from "@/lib/utils";

import {
  HeroBeatText,
  HeroHeadline,
  snowMountainHeroText,
} from "./snow-mountain-hero-text";

export type SnowMountainHeroMotionScrollLayersProps = {
  scrollState: HeroScrollState;
  reduceMotion: boolean;
};

const layerVerticalOffset = "-translate-y-8 sm:-translate-y-16";

const base =
  "pointer-events-auto absolute inset-y-0 z-1 flex max-w-[min(100%,52rem)] flex-col justify-center sm:max-w-[52rem]";

const slotLeft = cn(base, "left-2");
const slotRight = cn(
  base,
  "right-5 items-end text-right sm:right-8 lg:right-12",
);

function HeroMotionScrollLayersStatic() {
  return (
    <div
      className={cn(
        "pointer-events-auto absolute inset-x-5 inset-y-0 flex flex-col justify-center gap-12 py-12 sm:inset-x-8 lg:inset-x-12",
        layerVerticalOffset,
      )}
    >
      <div className="max-w-4xl">
        <HeroHeadline />
      </div>
      <div className="ml-auto max-w-md text-right">
        <HeroBeatText {...snowMountainHeroText.telco} />
      </div>
      <div className="max-w-lg">
        <HeroBeatText {...snowMountainHeroText.mission} />
      </div>
    </div>
  );
}

function HeroMotionScrollLayersAnimated({
  scrollState,
}: {
  scrollState: HeroScrollState;
}) {
  const primaryRef = useRef<HTMLDivElement>(null);
  const telcoRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = () => {
      const { primary, telco, mission } = getHeroScrollLayerStyles(scrollState.get());

      const primaryEl = primaryRef.current;
      if (primaryEl) {
        primaryEl.style.opacity = String(primary.opacity);
        primaryEl.style.transform = `translate3d(0, ${primary.y}px, 0)`;
      }

      const telcoEl = telcoRef.current;
      if (telcoEl) {
        telcoEl.style.opacity = String(telco.opacity);
        telcoEl.style.transform = `translate3d(0, ${telco.y}px, 0)`;
      }

      const missionEl = missionRef.current;
      if (missionEl) {
        missionEl.style.opacity = String(mission.opacity);
        missionEl.style.transform = `translate3d(0, ${mission.y}px, 0)`;
      }
    };

    apply();
    return scrollState.subscribe(apply);
  }, [scrollState]);

  return (
    <div className={cn("pointer-events-none relative h-full w-full", layerVerticalOffset)}>
      <div ref={primaryRef} className={cn(slotLeft, "will-change-[transform,opacity]")}>
        <HeroHeadline />
      </div>

      <div ref={telcoRef} className={cn(slotRight, "will-change-[transform,opacity]")}>
        <HeroBeatText {...snowMountainHeroText.telco} />
      </div>

      <div ref={missionRef} className={cn(slotLeft, "will-change-[transform,opacity]")}>
        <HeroBeatText {...snowMountainHeroText.mission} />
      </div>
    </div>
  );
}

export function SnowMountainHeroMotionScrollLayers({
  scrollState,
  reduceMotion,
}: SnowMountainHeroMotionScrollLayersProps) {
  if (reduceMotion) return <HeroMotionScrollLayersStatic />;
  return <HeroMotionScrollLayersAnimated scrollState={scrollState} />;
}
