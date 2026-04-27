"use client";

import type { CSSProperties, ReactNode } from "react";

import { motion, useTransform, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

export type HeroMotionScrollLayersProps = {
  scrollYProgress: MotionValue<number>;
  reduceMotion: boolean;
};

const labelWords = ["Independent", "telecom", "research"] as const;

const bodyClass = "text-base font-light leading-relaxed text-white/95 sm:text-lg";

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const t = (x - edge0) / (edge1 - edge0);
  return t * t * (3 - 2 * t);
}

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

function HeroMotionScrollLayersMotion({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const primaryOpacity = useTransform(scrollYProgress, (t) => 1 - smoothstep(0.19, 0.3, t));
  const primaryY = useTransform(scrollYProgress, (t) => {
    const rise = (1 - smoothstep(0, 0.12, t)) * 56;
    const lift = smoothstep(0.16, 0.3, t) * -36;
    return rise + lift;
  });

  const telcoOpacity = useTransform(
    scrollYProgress,
    (t) => smoothstep(0.22, 0.34, t) * (1 - smoothstep(0.42, 0.54, t)),
  );
  const telcoY = useTransform(scrollYProgress, (t) => {
    const rise = (1 - smoothstep(0.22, 0.38, t)) * 60;
    const lift = smoothstep(0.38, 0.54, t) * -40;
    return rise + lift;
  });

  const missionOpacity = useTransform(
    scrollYProgress,
    (t) => smoothstep(0.4, 0.52, t) * (1 - smoothstep(0.82, 0.94, t)),
  );
  const missionY = useTransform(scrollYProgress, (t) => {
    const rise = (1 - smoothstep(0.5, 0.55, t)) * 60;
    const lift = smoothstep(0.5, 0.78, t) * -32;
    return rise + lift;
  });

  return (
    <div className="pointer-events-none relative h-full w-full">
      <motion.div
        className={cn(slotLeft, "will-change-[transform,opacity]")}
        style={{ opacity: primaryOpacity, y: primaryY }}
      >
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
      </motion.div>

      <motion.div
        className={cn(slotRight, "will-change-[transform,opacity]")}
        style={{ opacity: telcoOpacity, y: telcoY }}
      >
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
      </motion.div>

      <motion.div
        className={cn(slotLeft, "will-change-[transform,opacity]")}
        style={{ opacity: missionOpacity, y: missionY }}
      >
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
      </motion.div>
    </div>
  );
}

export function HeroMotionScrollLayers({
  scrollYProgress,
  reduceMotion,
}: HeroMotionScrollLayersProps) {
  if (reduceMotion) return <HeroMotionScrollLayersStatic />;
  return <HeroMotionScrollLayersMotion scrollYProgress={scrollYProgress} />;
}
