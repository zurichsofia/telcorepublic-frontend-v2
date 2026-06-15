"use client";

import { useEffect, useRef } from "react";

import { getHeroScrollLayerStyles } from "@/lib/snow-mountain/hero-scroll-layer-styles";
import type { HeroScrollLayerStyles } from "@/lib/snow-mountain/hero-scroll-layer-styles";
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

type BeatKey = keyof HeroScrollLayerStyles;

const layerInsets =
  "absolute inset-x-5 inset-y-0 -translate-y-[8vh] sm:inset-x-8 sm:-translate-y-[6vh] lg:inset-x-12";

const beatWidth = {
  headline: "max-w-4xl",
  telco: "max-w-2xl",
  mission: "max-w-2xl",
} as const;

const beatSlotBase =
  "pointer-events-auto absolute inset-0 z-1 flex flex-col justify-center will-change-[transform,opacity]";

const beatSlotStart = cn(beatSlotBase, "items-start");
const beatSlotEnd = cn(beatSlotBase, "items-end text-right");

const heroBeats = [
  {
    key: "primary" as const,
    slotClass: beatSlotStart,
    widthClass: beatWidth.headline,
    staticWidthClass: beatWidth.headline,
    content: <HeroHeadline />,
  },
  {
    key: "telco" as const,
    slotClass: beatSlotEnd,
    widthClass: beatWidth.telco,
    staticWidthClass: cn(beatWidth.telco, "ml-auto text-right"),
    content: <HeroBeatText {...snowMountainHeroText.telco} />,
  },
  {
    key: "mission" as const,
    slotClass: beatSlotStart,
    widthClass: beatWidth.mission,
    staticWidthClass: beatWidth.mission,
    content: <HeroBeatText {...snowMountainHeroText.mission} />,
  },
] satisfies ReadonlyArray<{
  key: BeatKey;
  slotClass: string;
  widthClass: string;
  staticWidthClass: string;
  content: React.ReactNode;
}>;

function applyBeatStyle(
  element: HTMLDivElement | null,
  { opacity, y }: HeroScrollLayerStyles[BeatKey],
) {
  if (!element) return;
  element.style.opacity = String(opacity);
  element.style.transform = `translate3d(0, ${y}px, 0)`;
}

function HeroMotionScrollLayersStatic() {
  return (
    <div
      className={cn(
        layerInsets,
        "pointer-events-auto flex flex-col justify-center gap-12 py-12",
      )}
    >
      {heroBeats.map(({ key, staticWidthClass, content }) => (
        <div key={key} className={staticWidthClass}>
          {content}
        </div>
      ))}
    </div>
  );
}

function HeroMotionScrollLayersAnimated({
  scrollState,
}: {
  scrollState: HeroScrollState;
}) {
  const beatRefs = useRef<Record<BeatKey, HTMLDivElement | null>>({
    primary: null,
    telco: null,
    mission: null,
  });

  useEffect(() => {
    const apply = () => {
      const styles = getHeroScrollLayerStyles(scrollState.get());
      for (const { key } of heroBeats) {
        applyBeatStyle(beatRefs.current[key], styles[key]);
      }
    };

    apply();
    return scrollState.subscribe(apply);
  }, [scrollState]);

  return (
    <div className={cn(layerInsets, "pointer-events-none")}>
      {heroBeats.map(({ key, slotClass, widthClass, content }) => (
        <div
          key={key}
          ref={(element) => {
            beatRefs.current[key] = element;
          }}
          className={slotClass}
        >
          <div className={widthClass}>{content}</div>
        </div>
      ))}
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
