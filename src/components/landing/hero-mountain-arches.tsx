"use client";

import { useId } from "react";

/**
 * Thin elliptical / quadratic arcs in normalized 0–100 space (stretched by preserveAspectRatio="none").
 * Tuned for hero-alps2 + objectPosition ~44% / 42% - reads as faint signal beams over the ridge.
 */
const ARCHES: {
  d: string;
  opacity: number;
  strokeWidth: number;
}[] = [
    { d: "M 6 52 Q 14 34 22 52", opacity: 0.36, strokeWidth: 0.52 },
    // { d: "M 14 54 Q 22 36 30 54", opacity: 0.33, strokeWidth: 0.5 },
    { d: "M 20 50 Q 28 31 36 50", opacity: 0.4, strokeWidth: 0.54 },
    // { d: "M 30 52 Q 39 33 48 52", opacity: 0.35, strokeWidth: 0.5 },
    { d: "M 34 48 Q 44 29 54 48", opacity: 0.42, strokeWidth: 0.56 },
    // { d: "M 42 51 Q 52 32 62 51", opacity: 0.34, strokeWidth: 0.5 },
    // { d: "M 46 47 Q 56 28 66 47", opacity: 0.38, strokeWidth: 0.52 },
    { d: "M 50 43 Q 60 25 70 43", opacity: 0.44, strokeWidth: 0.58 },
    { d: "M 58 45 Q 68 27 78 45", opacity: 0.36, strokeWidth: 0.52 },
    { d: "M 70 44 Q 79 28 88 44", opacity: 0.34, strokeWidth: 0.48 },
    // { d: "M 74 50 Q 82 34 90 50", opacity: 0.32, strokeWidth: 0.48 },
    // { d: "M 78 46 Q 86 33 94 46", opacity: 0.36, strokeWidth: 0.5 },
  ];

export function HeroMountainArches() {
  const uid = useId();
  const filterId = `${uid.replace(/:/g, "")}-arch-glow`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen opacity-[0.78] drop-shadow-[0_0_6px_rgba(125,211,252,0.28)]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.25" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        {ARCHES.map((a, i) => (
          <path
            key={i}
            d={a.d}
            fill="none"
            stroke="rgb(186 230 253)"
            strokeLinecap="round"
            strokeWidth={a.strokeWidth}
            opacity={a.opacity}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
