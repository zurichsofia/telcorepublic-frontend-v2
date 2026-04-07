"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/video/abstract-fractal-alpha.mp4";

const GRAIN_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <filter id="n" x="0" y="0">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/>
</svg>
`.trim());

export function ServicesAuroraBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const p = el.play();
    if (p !== undefined && typeof p.catch === "function") p.catch(() => {});
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 min-h-112 overflow-hidden bg-[#dbe5f2]"
      aria-hidden
    >
      {/*
        Base #dbe5f2 + video (normal alpha). Top layers use rgba(219,229,242,…) so the section
        reads as your blue while motion still shows through the veil.
      */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-[1.02] transform-gpu object-cover opacity-[0.38]"
        style={{
          filter:
            "brightness(1.26) contrast(1.02) saturate(1.45) hue-rotate(198deg) blur(2px)",
        }}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Primary brand bind — ~30–40% #dbe5f2 over the clip so color comes back */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            168deg,
            rgba(219, 229, 242, 0.42) 0%,
            rgba(219, 229, 242, 0.28) 38%,
            rgba(219, 229, 242, 0.32) 62%,
            rgba(219, 229, 242, 0.38) 100%
          )`,
        }}
      />

      {/* Slightly clearer “aurora” in the middle; edges stay on-brand */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 95% 88% at 50% 40%,
            rgba(219, 229, 242, 0.06) 0%,
            rgba(219, 229, 242, 0.2) 52%,
            rgba(219, 229, 242, 0.34) 100%
          )`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 200% 120% at 50% 36%,
            rgba(255, 255, 255, 0.14) 0%,
            transparent 52%
          )`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(176, 204, 232, 0.14) 100%
          )`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
