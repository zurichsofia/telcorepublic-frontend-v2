"use client";

import type { CSSProperties } from "react";

type SnowMountainHeroCursorGlowProps = {
  position: { x: number; y: number } | null;
};

export function SnowMountainHeroCursorGlow({
  position,
}: SnowMountainHeroCursorGlowProps) {
  if (position == null) return null;

  return (
    <div
      className="pointer-events-none fixed z-[25] size-[min(22vw,9.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={
        {
          left: position.x,
          top: position.y,
          background:
            "radial-gradient(circle, rgba(255,250,240,0.78) 0%, rgba(210,235,255,0.28) 38%, transparent 72%)",
          mixBlendMode: "screen",
          boxShadow:
            "0 0 34px 15px rgba(255,252,248,0.24), inset 0 0 20px rgba(255,255,255,0.38)",
        } as CSSProperties
      }
      aria-hidden
    />
  );
}
