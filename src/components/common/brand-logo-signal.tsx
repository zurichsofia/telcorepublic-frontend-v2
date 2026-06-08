"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const SIGNAL_DOT_COUNT = 12;
/** Seconds between each dot’s pulse (one full sweep = count × step). */
const SEEK_STEP_S = 1;

const LOGO_SRC_ON_DARK = "/logo/TelcoRepublic_Logo_white.png";
const LOGO_SRC_BRAND = "/logo/TecloRepulic_logo_red_black.png";

export type BrandLogoSignalProps = {
  className?: string;
  priority?: boolean;
  /** When set, wraps the mark in a link. Omit on loaders. */
  href?: string;
  /**
   * `onDark` — white raster, white signal dots (dark footer, blog shell).
   * `brand` — red/black raster, black signal dots (hero overlay).
   * `onLight` — red/black raster, black signal dots (light nav surface).
   */
  variant?: "onDark" | "brand" | "onLight";
  /** `compact` — smaller wordmark and signal dots (e.g. site header). */
  size?: "default" | "compact";
};

const logoImageClassDefault = "h-10 w-auto object-contain sm:h-12";
const logoImageClassCompact = "h-7 w-auto object-contain sm:h-8";

export function BrandLogoSignal({
  className,
  priority,
  href,
  variant = "onDark",
  size = "default",
}: BrandLogoSignalProps) {
  const compact = size === "compact";
  const logoImageClass = compact ? logoImageClassCompact : logoImageClassDefault;

  const logoSrc = variant === "onDark" ? LOGO_SRC_ON_DARK : LOGO_SRC_BRAND;
  const signalDotsOnDark = variant === "onDark";

  const seekPeriodS = SIGNAL_DOT_COUNT * SEEK_STEP_S;
  /** Horizontal inset so the dot row matches typographic width (raster has clear margins). */
  const trackPadInline = compact ? "0.16%" : "0%";
  const shellStyle = {
    "--seek-period": `${seekPeriodS}s`,
    "--brand-signal-track-pad-inline": trackPadInline,
  } as CSSProperties;

  const inner = (
    <div
      className={cn(
        "inline-flex flex-col items-stretch",
        compact ? "gap-1" : "gap-1.5",
        !href && className,
      )}
      style={shellStyle}
    >
      <Image
        src={logoSrc}
        alt="Telco Republic"
        width={200}
        height={40}
        className={logoImageClass}
        priority={priority}
      />
      <div
        className={cn(
          "box-border flex w-full justify-between gap-0.5",
          "px-(--brand-signal-track-pad-inline)",
          signalDotsOnDark ? "brand-signal-dots-on-dark" : "brand-signal-dots-on-light",
          compact && "brand-signal-dots-compact",
        )}
        aria-hidden
      >
        {Array.from({ length: SIGNAL_DOT_COUNT }, (_, i) => (
          <span
            key={i}
            className="brand-signal-dot shrink-0"
            style={
              {
                "--seek-delay": `${i * SEEK_STEP_S}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex w-fit shrink-0 focus-visible:outline-none",
          className,
        )}
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
