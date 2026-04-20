"use client";

import FloatingLines from "@/components/FloatingLines";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Site-wide WebGL backdrop. Service hero stays visually separate via its own
 * opaque surface (`bg-white` on `ServiceVideoHero`).
 */
export function AppFloatingLinesBackground() {
  const reduceMotion = usePrefersReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 min-h-[100dvh] w-full bg-white"
    >
      <FloatingLines
        lightBackground
        interactive={false}
        parallax={false}
        animationSpeed={0.7}
        linesGradient={["#cfd6dd", "#9aa5ad", "#eb1e25", "#6e7680"]}
        enabledWaves={["top", "bottom"]}
        lineCount={[8, 10]}
        lineDistance={[9, 9]}
        topWavePosition={{ x: 10, y: 0.72, rotate: -0.38 }}
        bottomWavePosition={{ x: 1.9, y: -0.92, rotate: -0.95 }}
      />
    </div>
  );
}
