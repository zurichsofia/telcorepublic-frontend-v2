"use client";

import { HeroGlassNav } from "@/components/landing/hero-glass-nav";

/** Plain header — entrance motion lives on `HeroGlassNav` only (no nested motion wrappers). */
export function HeroNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-5 pt-5 sm:px-8 sm:pt-7">
      <div className="relative mx-auto flex max-w-[min(100%,1400px)] items-center justify-between">
        <HeroGlassNav />
      </div>
    </header>
  );
}
