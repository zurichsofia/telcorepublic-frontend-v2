"use client";

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
  return (
    <section
      id="global-reach"
      className="relative w-full overflow-hidden bg-white py-24 sm:pb-32"
      aria-labelledby="global-reach-heading"
    >
      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
        {/* <p className="text-xs font-medium uppercase tracking-widest text-telco-red">
          International footprint
        </p> */}
        <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-black md:text-xl">
          Leverage Telco Republic&apos;s network to connect with industry leaders and
          emerging technology solutions, fostering co-innovation and expanding your
          market reach.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <WorldMap dots={GLOBAL_REACH_DOTS} />
      </div>
    </section>
  );
}
