"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const SIGNAL_DOT_COUNT = 12;

export type BrandLogoSignalProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogoSignal({
  className,
  priority,
}: BrandLogoSignalProps) {
  return (
    <div className={cn("inline-flex flex-col items-stretch gap-1.5", className)}>
      <Image
        src="/logo/TelcoRepublic_Logo_white.png"
        alt="Telco Republic"
        width={200}
        height={40}
        className="h-8 w-auto object-contain"
        priority={priority}
      />
      <div className="flex w-full justify-between gap-0.5 px-px" aria-hidden>
        {Array.from({ length: SIGNAL_DOT_COUNT }, (_, i) => {
          const base =
            0.1 + (i / Math.max(1, SIGNAL_DOT_COUNT - 1)) * 0.82;
          return (
            <span
              key={i}
              className="hero-nav-signal-dot shrink-0"
              style={
                {
                  "--dot-base": String(base),
                  animationDelay: `${i * 0.075}s`,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
}
