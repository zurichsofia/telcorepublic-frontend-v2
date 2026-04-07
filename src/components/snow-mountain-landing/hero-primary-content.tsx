"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type HeroPrimaryContentProps = {
  reduceMotion: boolean;
};

const labelWords = ["Independent", "telecom", "research"] as const;
const headlineLine0 = ["Navigating", "the", "shift."] as const;
const headlineLine1 = ["Leading", "the", "Techco", "Revolution"] as const;

export function HeroPrimaryContent({ reduceMotion }: HeroPrimaryContentProps) {
  return (
    <div
      className="pointer-events-auto mx-auto flex min-h-dvh w-full max-w-[min(100%,1400px)] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-24"
      style={{
        opacity: "var(--sm-primary-opacity)",
        transform: "translate3d(var(--sm-primary-x), var(--sm-primary-y), 0)",
      }}
    >
      <div className="max-w-2xl">
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.38em] text-[#001538]">
          {labelWords.map((word, i) => (
            <span
              key={word}
              className={cn(
                "mr-[0.35em] inline-block last:mr-0",
                !reduceMotion && "snow-mountain-hero-clip",
              )}
              style={
                { "--clip-delay": `${0.08 + i * 0.06}s` } as CSSProperties
              }
            >
              {word}
            </span>
          ))}
        </p>

        <h1
          className={cn(
            "mt-5 font-display text-[clamp(2.5rem,7.5vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.022em] text-[#001538]",
            "[text-shadow:0_1px_0_rgba(255,255,255,0.92),0_0_20px_rgba(248,252,255,0.55),0_0_48px_rgba(255,255,255,0.22)]",
          )}
        >
          <span
            className="block"
            style={{ transform: "translateY(var(--sm-h1-0-y))" }}
          >
            {headlineLine0.map((word, i) => (
              <span
                key={word}
                className={cn(
                  "mr-[0.32em] inline-block last:mr-0",
                  !reduceMotion && "snow-mountain-hero-clip",
                )}
                style={
                  { "--clip-delay": `${0.14 + i * 0.08}s` } as CSSProperties
                }
              >
                {word}
              </span>
            ))}
          </span>
          <span
            className="mt-1 block sm:mt-1.5"
            style={{ transform: "translateY(var(--sm-h1-1-y))" }}
          >
            {headlineLine1.map((word, i) => (
              <span
                key={word}
                className={cn(
                  "mr-[0.32em] inline-block text-[#001538] last:mr-0",
                  !reduceMotion && "snow-mountain-hero-clip",
                )}
                style={
                  {
                    "--clip-delay": `${0.3 + i * 0.07}s`,
                  } as CSSProperties
                }
              >
                {word}
              </span>
            ))}
          </span>
        </h1>

        <div style={{ transform: "translateY(var(--sm-subcopy-y))" }}>
          <p className="mt-7 mb-32 max-w-md text-base font-light leading-[1.75] text-white sm:text-[1.05rem]">
            Fact-Based Research. Actionable Disruption.
          </p>
        </div>
      </div>
    </div>
  );
}
