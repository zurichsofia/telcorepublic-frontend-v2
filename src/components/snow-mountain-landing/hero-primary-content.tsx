"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type HeroPrimaryContentProps = {
  reduceMotion: boolean;
};

const labelWords = ["Independent", "telecom", "research"] as const;

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
        <p className="font-display text-xs font-medium uppercase tracking-widest text-[var(--color-telco-red)]">
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

        <h1 className="mt-5 font-display text-6xl font-normal tracking-tight text-white leading-tight">
          <span
            className="block"
            style={{ transform: "translateY(var(--sm-h1-0-y))" }}
          >
            Navigating the shift.
          </span>
          <span
            className="mt-1 block sm:mt-1.5"
            style={{ transform: "translateY(var(--sm-h1-1-y))" }}
          >
            Leading the Techco Revolution
          </span>
        </h1>


        {/* TODO: This is hidden w opacity-0 */}
        <div style={{ transform: "translateY(var(--sm-subcopy-y))" }} className="opacity-0">
          <p className="mt-7 mb-32 max-w-md text-base font-light leading-relaxed text-white sm:text-lg">
            Leading the Techco Revolution
            <br />
            Fact-Based Research.
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}
