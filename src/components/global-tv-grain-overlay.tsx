"use client";

import { TvStaticGrain } from "@/components/landing/tv-static-grain";

/** Site-wide film grain; fixed above page content, pointer-events pass through. */
export function GlobalTvGrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <TvStaticGrain opacity={0.2} staticAmount={0.94} />
    </div>
  );
}
