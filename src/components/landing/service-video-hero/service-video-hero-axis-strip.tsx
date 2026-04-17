"use client";

import type { MutableRefObject } from "react";
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from "react";

import type { services } from "@/data/services";

function subtitleFromDesc(desc: string, maxLen = 72) {
  const t = desc.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trimEnd()}…`;
}

type ServiceVideoHeroAxisStripProps = {
  services: typeof services;
  activeIndex: number;
  sectionCount: number;
  titleSlideRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  axisLineRef: React.RefObject<HTMLDivElement | null>;
  onAxisPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onAxisKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
};

export function ServiceVideoHeroAxisStrip({
  services,
  activeIndex,
  sectionCount,
  titleSlideRefs,
  axisLineRef,
  onAxisPointerDown,
  onAxisKeyDown,
}: ServiceVideoHeroAxisStripProps) {
  return (
    <div
      data-axis-strip
      className="pointer-events-none absolute inset-x-0 top-[calc(50%+clamp(1.25rem,3.5vh,2.75rem))] z-40 flex max-w-full -translate-y-1/2 flex-col justify-center overflow-x-clip"
    >
      <div className="relative w-full min-w-0 max-w-full">
        <div className="relative mb-3 min-h-[3.25rem] w-full min-w-0 max-w-full sm:mb-4 sm:min-h-[3.75rem]">
          <div className="pointer-events-none relative z-20 flex w-full min-w-0 max-w-full min-h-[3.25rem] items-center overflow-x-hidden overflow-y-hidden sm:min-h-[3.75rem]">
            {services.map((service, i) => (
              <div
                key={service.title}
                ref={(el) => {
                  titleSlideRefs.current[i] = el;
                }}
                className="absolute inset-0 flex items-center will-change-[transform,opacity]"
                aria-hidden={i !== activeIndex}
              >
                <h2 className="font-display w-full px-10 text-left text-3xl font-normal uppercase leading-none tracking-wide text-[var(--color-telco-red)] sm:text-4xl lg:text-5xl">
                  {service.title}
                </h2>
              </div>
            ))}
          </div>

          <div
            ref={axisLineRef}
            className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-30 flex items-center font-display text-3xl leading-none sm:text-4xl lg:text-5xl"
          >
            <div className="pointer-events-none relative h-px w-full -translate-y-[0.1em]">
              <div className="absolute inset-0 bg-[var(--color-telco-red)]/50" />
            </div>
            <div
              role="slider"
              aria-valuemin={0}
              aria-valuemax={sectionCount - 1}
              aria-valuenow={activeIndex}
              aria-label="Service position"
              tabIndex={0}
              onKeyDown={onAxisKeyDown}
              onPointerDown={onAxisPointerDown}
              className="pointer-events-auto absolute inset-x-0 -top-6 -bottom-6 z-10 cursor-grab touch-none active:cursor-grabbing"
            />
          </div>
        </div>

        <p className="pointer-events-none mx-auto mt-6 max-w-2xl px-5 text-left font-sans text-xs font-normal uppercase leading-relaxed tracking-widest text-white/40 sm:mt-7 sm:px-10 lg:px-14">
          {subtitleFromDesc(services[activeIndex]?.desc ?? "")}
        </p>
      </div>
    </div>
  );
}
