"use client";

import { useReducedMotion } from "motion/react";

import Grainient from "./Grainient";

/** Full-viewport React Bits Grainient - replaces the old CSS gradient on `html`. */
export function GrainientPageBg() {
  const reduce = useReducedMotion();



  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='none' stroke='%23a8d8f8' stroke-width='0.4' d='M16 0v32M0 16h32M8 4l16 24M24 4L8 28' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* <Grainient
        className="absolute inset-0 h-full w-full"
        timeSpeed={reduce ? 0 : 0.22}
        color1="#2d3135"
        color2="#413e4a"
        color3="#040612"
        grainAmount={0.08}
        warpStrength={0.85}
      /> */}
    </div>
  );
}
