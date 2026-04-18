"use client";

import { ChevronsDown, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ServiceVideoHeroScrollHintProps = {
  dismissed?: boolean;
  /** When false, only the “scroll down” row is shown (single slide). */
  showHorizontalNav: boolean;
};

export function ServiceVideoHeroScrollHint({
  dismissed = false,
  showHorizontalNav,
}: ServiceVideoHeroScrollHintProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-8 z-[25] flex justify-center px-6 transition-opacity duration-800 animate-pulse",
        dismissed ? "opacity-0" : "opacity-100",
      )}
      aria-hidden="true"
    >
      <div className="flex max-w-sm flex-col items-center text-center">
        {showHorizontalNav ? (
          <div className="flex w-full max-w-[min(100%,20rem)] items-center justify-between gap-2 sm:max-w-[22rem] pb-1.5">

            <div className="min-w-0 flex-1">
              <p className="font-display font-medium uppercase tracking-widest text-white text-[10px] text-shadow:0_1px_2px_rgba(0,0,0,0.22)">
                Drag or use arrows to navigate
              </p>

            </div>
            <div className="flex">
              <ChevronsLeft
                className="size-4 shrink-0 text-white text-[10px]"
                strokeWidth={1.5}
                aria-hidden
              />
              <ChevronsRight
                className="size-4 shrink-0 text-white text-[10px]"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            "flex items-center justify-center gap-2 text-white/65",
            showHorizontalNav && "w-full border-t border-white/12 pt-2",
          )}
        >
          <p className="font-display text-[10px] font-light uppercase tracking-widest text-white text-shadow:0_1px_2px_rgba(0,0,0,0.22)">
            Scroll down to continue
          </p>
          <ChevronsDown
            className="size-4 shrink-0 text-white/40 text-[10px]"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
