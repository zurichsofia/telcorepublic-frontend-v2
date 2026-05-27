"use client";

import FloatingLines from "@/components/common/floating-lines/floating-lines";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Soft neutrals + sparse brand red — light editorial field. */
const LINE_GRADIENT = [
  "#dde3ea",
  "#eb1e25",
  "#c8d0d8",
  "#b8c2cc",
] as const;

const SECTION_ID = "why-telco-republic";

export type FloatingLinesWhyUsBackgroundProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * Why Us editorial field: sticky viewport canvas behind long-form content.
 * Avoids fixed + clip-path (WebGL compositor glitches) and uses section-linear
 * scroll parallax so lines keep drifting through every chapter.
 */
export function FloatingLinesWhyUsBackground({
  className,
  style,
  children,
}: FloatingLinesWhyUsBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div
        id={SECTION_ID}
        className={cn("relative bg-white", className)}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      id={SECTION_ID}
      className={cn("relative bg-white", className)}
      style={style}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0"
        aria-hidden
      >
        <div className="sticky top-0 h-svh w-full opacity-55 sm:opacity-65 [transform:translateZ(0)]">
          <FloatingLines
            lightBackground
            interactive={false}
            parallax
            scrollParallaxSectionId={SECTION_ID}
            scrollParallaxStrength={6}
            animationSpeed={0.22}
            linesGradient={[...LINE_GRADIENT]}
            enabledWaves={["middle", "bottom"]}
            lineCount={[4, 3]}
            lineDistance={[24, 30]}
            middleWavePosition={{ x: -0.8, y: -0.6, rotate: 0.45 }}
            bottomWavePosition={{ x: 1.4, y: -1.0, rotate: -0.35 }}
          />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
