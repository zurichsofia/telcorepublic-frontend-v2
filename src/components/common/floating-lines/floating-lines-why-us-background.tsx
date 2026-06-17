"use client";

import FloatingLines from "@/components/common/floating-lines/floating-lines";
import { useIsMobileDevice } from "@/hooks/use-is-mobile-device";
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
 * Lines scroll in/out naturally with the section — no fixed-position sync.
 */
export function FloatingLinesWhyUsBackground({
  className,
  style,
  children,
}: FloatingLinesWhyUsBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobileDevice();

  if (reducedMotion || isMobile) {
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
        <div className="sticky top-0 h-svh w-full opacity-55 sm:opacity-65">
          <FloatingLines
            lightBackground
            interactive={false}
            parallax={false}
            freezeTimeWhileScrolling
            maxPixelRatio={1.25}
            animationFps={20}
            animationSpeed={1}
            linesGradient={[...LINE_GRADIENT]}
            enabledWaves={["top", "bottom"]}
            lineCount={[4, 3]}
            lineDistance={[24, 30]}
            topWavePosition={{ x: 3, y: -0.95, rotate: 0.72 }}
            bottomWavePosition={{ x: 1.8, y: -0.4, rotate: -0.45 }}
          />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
