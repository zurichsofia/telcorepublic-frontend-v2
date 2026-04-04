"use client";

import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";

/** Animated headline word — Aceternity-style letter stagger */
const headlineWord = "everywhere";

export function GlobalReachMapSection() {
  return (
    <section
      id="global-reach"
      className="w-full border-y border-[rgba(255,255,255,0.06)] bg-[#020203] py-24 sm:py-32"
      aria-labelledby="global-reach-heading"
    >
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-label)]">
          International footprint
        </p>
        <p
          id="global-reach-heading"
          className="font-display mt-5 text-2xl font-normal tracking-tight text-[var(--color-heading)] md:text-4xl"
        >
          Who We Serve
          <span className="text-[var(--color-body)]">
            {headlineWord.split("").map((letter, idx) => (
              <motion.span
                key={`${letter}-${idx}`}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-[var(--color-body)] md:text-lg">
          Leverage Telco Republic’s network to connect with industry leaders and emerging technology solutions, fostering co-innovation and expanding your market reach.        </p>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <WorldMap
          lineColor="rgba(255, 180, 100, 0.95)"
          dots={[
            {
              start: { lat: 47.3769, lng: 8.5417, pulse: true }, // Zurich
              end: { lat: 51.5074, lng: -0.1278 }, // London
            },
            {
              start: { lat: 51.5074, lng: -0.1278 },
              end: { lat: 40.7128, lng: -74.006 }, // New York
            },
            {
              start: { lat: 51.5074, lng: -0.1278 },
              end: { lat: 25.2048, lng: 55.2708 }, // Dubai
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 1.3521, lng: 103.8198 }, // Singapore
            },
            {
              start: { lat: 1.3521, lng: 103.8198 },
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 40.7128, lng: -74.006 },
              end: { lat: -23.5505, lng: -46.6333 }, // São Paulo
            },
          ]}
        />
      </div>
    </section>
  );
}
