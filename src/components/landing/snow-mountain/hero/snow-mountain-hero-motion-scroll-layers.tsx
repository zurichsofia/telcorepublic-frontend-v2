"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { getHeroScrollLayerStyles } from "@/lib/snow-mountain/hero-scroll-layer-styles";
import type { ScrollProgressStore } from "@/lib/snow-mountain/scroll-progress";
import { cn } from "@/lib/utils";

export type SnowMountainHeroMotionScrollLayersProps = {
  scrollProgress: ScrollProgressStore;
  reduceMotion: boolean;
};

const labelWords = ["Independent", "telecom", "research"] as const;

const bodyClass = "text-base font-light leading-relaxed text-white/95 sm:text-lg";

const base =
  "pointer-events-auto absolute inset-y-0 z-1 flex max-w-[min(100%,52rem)] flex-col justify-center sm:max-w-[52rem]";

const slotLeft = cn(base, "left-5 sm:left-8 lg:left-12");
const slotRight = cn(
  base,
  "right-5 items-end text-right sm:right-8 lg:right-12",
);

function HeroMotionScrollLayersStatic() {
  return (
    <div className="pointer-events-auto absolute inset-x-5 inset-y-0 flex flex-col justify-center gap-16 py-12 sm:inset-x-8 lg:inset-x-12">
      <div className="max-w-4xl">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          {labelWords.join(" ")}
        </p>
        <h1 className="mt-6 font-display text-2xl font-normal leading-[1.05] tracking-tight text-white">
          Navigating the shift.
          <span className="mt-2 block sm:mt-3">Leading the Techco Revolution</span>
        </h1>
      </div>
      <div className="ml-auto max-w-md text-right">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p>
        <p className="mt-6 font-display text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-tight tracking-tight text-white">
          Crossing the Telco Chasm
        </p>
        <p className={cn("mt-6 max-w-prose", bodyClass)}>
          We are the go-to, thought-provoking market research and advisory firm in the new
          telecommunications software market.
        </p>
      </div>
      <div className="max-w-lg">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p>
        <p className="mt-6 font-display text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-tight tracking-tight text-white">
          Our Mission
        </p>
        <p className={cn("mt-6 max-w-prose", bodyClass)}>
          We track ongoing disruption and innovation related to telecommunications business and
          operations.
        </p>
      </div>
    </div>
  );
}

function HeroMotionScrollLayersAnimated({
  scrollProgress,
}: {
  scrollProgress: ScrollProgressStore;
}) {
  const primaryRef = useRef<HTMLDivElement>(null);
  const telcoRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = () => {
      const { primary, telco, mission } = getHeroScrollLayerStyles(
        scrollProgress.get(),
      );

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
    return scrollProgress.subscribe(apply);
  }, [scrollProgress]);

  return (
    <div className="pointer-events-none relative h-full w-full">
      <div ref={primaryRef} className={cn(slotLeft, "will-change-[transform,opacity]")}>
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          {labelWords.map((word, i) => (
            <span
              key={word}
              className={cn("mr-[0.35em] inline-block last:mr-0", "snow-mountain-hero-clip")}
              style={{ "--clip-delay": `${0.08 + i * 0.06}s` } as CSSProperties}
            >
              {word}
            </span>
          ))}
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-tight text-white">
          <span className="block text-shadow-lg">Navigating the shift.</span>
          <span className="mt-2 block sm:mt-3 text-shadow-lg">Leading the Techco Revolution</span>
        </h1>
      </div>

      <div ref={telcoRef} className={cn(slotRight, "will-change-[transform,opacity]")}>
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p>
        <p className="mt-6 font-display text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-tight tracking-tight text-white text-shadow-lg">
          Crossing the Telco Chasm
        </p>
        <p className={cn("mt-6 max-w-2xl text-shadow-lg", bodyClass)}>
          We are the go-to, thought-provoking market research and advisory firm in the new
          telecommunications software market.
        </p>
      </div>

      <div ref={missionRef} className={cn(slotLeft, "will-change-[transform,opacity]")}>
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          Telcorepublic
        </p>
        <p className="mt-6 font-display text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-tight tracking-tight text-white text-shadow-lg">
          Our Mission
        </p>
        <p className={cn("mt-6 max-w-2xl text-shadow-lg", bodyClass)}>
          We track ongoing disruption and innovation related to telecommunications business and
          operations.
        </p>
      </div>
    </div>
  );
}

export function SnowMountainHeroMotionScrollLayers({
  scrollProgress,
  reduceMotion,
}: SnowMountainHeroMotionScrollLayersProps) {
  if (reduceMotion) return <HeroMotionScrollLayersStatic />;
  return <HeroMotionScrollLayersAnimated scrollProgress={scrollProgress} />;
}
