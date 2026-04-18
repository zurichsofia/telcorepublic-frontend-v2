"use client";

import AnimatedContent from "@/components/AnimatedContent";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import WorldMap from "@/components/ui/world-map";

const GLOBAL_REACH_DOTS = [
  {
    start: { lat: 47.3769, lng: 8.5417, pulse: true as const },
    end: { lat: 51.5074, lng: -0.1278 },
  },
  {
    start: { lat: 51.5074, lng: -0.1278 },
    end: { lat: 40.7128, lng: -74.006 },
  },
  {
    start: { lat: 51.5074, lng: -0.1278 },
    end: { lat: 25.2048, lng: 55.2708 },
  },
  {
    start: { lat: 28.6139, lng: 77.209 },
    end: { lat: 1.3521, lng: 103.8198 },
  },
  {
    start: { lat: 1.3521, lng: 103.8198 },
    end: { lat: 35.6762, lng: 139.6503 },
  },
  {
    start: { lat: 40.7128, lng: -74.006 },
    end: { lat: -23.5505, lng: -46.6333 },
  },
] as const;

export function GlobalReachMapSection() {
  const reduce = usePrefersReducedMotion();

  const mapBlock = <WorldMap dots={GLOBAL_REACH_DOTS} />;

  return (
    <section
      id="global-reach"
      className="relative w-full overflow-hidden bg-white py-24 sm:py-32"
      aria-labelledby="global-reach-heading"
    >
      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
        <ScrollReveal from="up">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-telco-red)]">
            International footprint
          </p>
        </ScrollReveal>
        <ScrollReveal from="up" delayMs={100}>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-black md:text-lg">
            Leverage Telco Republic&apos;s network to connect with industry leaders and
            emerging technology solutions, fostering co-innovation and expanding your
            market reach.
          </p>
        </ScrollReveal>
      </div>

      {reduce ? (
        <div className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8">{mapBlock}</div>
      ) : (
        <AnimatedContent
          className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8"
          distance={28}
          duration={0.95}
          ease="power3.out"
          threshold={0.18}
        >
          {mapBlock}
        </AnimatedContent>
      )}
    </section>
  );
}
