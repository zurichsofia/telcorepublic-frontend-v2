"use client";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import FloatingLines from "@/components/common/floating-lines/floating-lines";

/** Cool neutrals + sparse brand red — reads as signal, not neon wallpaper. */
const LINE_GRADIENT = [
  "#1a1a1f",
  "#2e2e35",
  "#eb1e25",
  "#3a3a42",
  "#eb1e25",
] as const;

/** Fade WebGL in/out at vertical edges so blend output never meets the flat shell — removes the “border” at nav/footer. */
const EDGE_FADE_MASK =
  "linear-gradient(to bottom, transparent 0px, black 100px, black calc(100% - 100px), transparent 100%)";

export type FloatingLinesContactBackgroundProps = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Contact-page field. Base matches `bg-telco-dark` (#191919) with the shell/header
 * so the hero does not read as a separate color block.
 */
export function FloatingLinesContactBackground({
  className,
  children,
}: FloatingLinesContactBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div
        className={cn(
          "relative min-h-dvh overflow-hidden bg-telco-dark",
          className,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-telco-red/10 via-transparent to-white/5"
          aria-hidden
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-hidden bg-telco-dark",
        className,
      )}
    >
      {/* Edge mask: top/bottom show parent `bg-telco-dark` only (same as nav/footer), so plus-lighter output never abuts the flat shell. */}
      <div
        className="pointer-events-auto absolute inset-0 z-0 opacity-40 sm:opacity-50"
        style={{
          maskImage: EDGE_FADE_MASK,
          WebkitMaskImage: EDGE_FADE_MASK,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
        aria-hidden
      >
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[2, 3, 2]}
          lineDistance={[26, 20, 26]}
          bendRadius={5.5}
          bendStrength={-0.55}
          mouseDamping={0.1}
          interactive
          parallax
          parallaxStrength={0.1}
          animationSpeed={0.38}
          linesGradient={[...LINE_GRADIENT]}
          lightBackground={false}
          mixBlendMode="plus-lighter"
        />
      </div>
      {children}
    </div>
  );
}
