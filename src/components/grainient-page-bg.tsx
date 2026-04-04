"use client";

import { useReducedMotion } from "motion/react";

import Grainient from "./Grainient";

/** Full-viewport React Bits Grainient — replaces the old CSS gradient on `html`. */
export function GrainientPageBg() {
  const reduce = useReducedMotion();



  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Grainient
        className="absolute inset-0 h-full w-full"
        timeSpeed={reduce ? 0 : 0.22}
        color1="#2d3135"
        color2="#413e4a"
        color3="#040612"
        grainAmount={0.08}
        warpStrength={0.85}
      />
    </div>
  );
}
