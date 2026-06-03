"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { getHeroScrollLayerStyles } from "@/lib/snow-mountain/hero-scroll-layer-styles";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import { cn } from "@/lib/utils";

export type SnowMountainHeroMotionScrollLayersProps = {
  scrollState: HeroScrollState;
  reduceMotion: boolean;
};

const labelWords = ["Independent", "telecom", "research"] as const;

const bodyClass = "text-lg font-light leading-relaxed text-black/95 sm:text-xl";

const layerVerticalOffset = "-translate-y-16";

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
        <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-telco-red">
          {labelWords.join(" ")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-normal text-black">
          Navigating the shift.
          <span className="mt-1 block sm:mt-1.5">Leading the Techco Revolution.</span>
        </h1>
      </div>
      <div className="ml-auto max-w-md text-right">
        <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p>
        <p className="mt-2 font-display text-[clamp(2rem,5vw,3.25rem)] font-normal leading-tight tracking-tight text-black">
          Crossing the Telco Chasm
        </p>
        <p className={cn("max-w-prose", bodyClass)}>
          We are the go-to, thought-provoking market research and advisory firm in the new
          telecommunications software market.
        </p>
      </div>
      <div className="max-w-lg">
        <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p>
        <p className="mt-2 font-display text-[clamp(2rem,5vw,3.25rem)] font-normal leading-tight tracking-tight text-black">
          Our Mission
        </p>
        <p className={cn("mt-2 max-w-prose", bodyClass)}>
          We track ongoing disruption and innovation related to telecommunications business and
          operations.
        </p>
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
        <h1 className="mt-2 font-display text-7xl font-normal leading-[1.05] tracking-tight text-black">
          <span className="block text-shadow-lg">Navigating the shift.</span>
          <span className="mt-1 block sm:mt-1.5 text-shadow-lg">Leading the Techco Revolution.</span>
        </h1>
      </div>

      <div ref={telcoRef} className={cn(slotRight, "will-change-[transform,opacity]")}>
        {/* <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p> */}
        <p className="mt-2 font-display text-[clamp(2rem,5vw,3.25rem)] font-normal leading-tight tracking-tight text-black text-shadow-lg">
          Crossing the Telco Chasm
        </p>
        <p className={cn("mt-2 max-w-2xl text-shadow-lg", bodyClass)}>
          We are the go-to, thought-provoking market research and advisory firm in the new
          telecommunications software market.
        </p>
      </div>

      <div ref={missionRef} className={cn(slotLeft, "will-change-[transform,opacity]")}>
        {/* <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p> */}
        <p className="mt-2 font-display text-[clamp(2rem,5vw,3.25rem)] font-normal leading-tight tracking-tight text-black text-shadow-lg">
          Our Mission
        </p>
        <p className={cn("mt-2 max-w-2xl text-shadow-lg", bodyClass)}>
          We track ongoing disruption and innovation related to telecommunications business and
          operations.
        </p>
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
