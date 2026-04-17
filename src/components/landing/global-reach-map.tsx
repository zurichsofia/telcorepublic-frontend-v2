"use client";

import WorldMap from "@/components/ui/world-map";
import { motion, useReducedMotion } from "motion/react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export function GlobalReachMapSection() {
  const reduce = useReducedMotion();

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

      <motion.div
        className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8"
        initial={reduce ? undefined : { opacity: 0, y: 28 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.95, ease }}
      >
        <WorldMap
          dots={[
            {
              start: { lat: 47.3769, lng: 8.5417, pulse: true },
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
          ]}
        />
      </motion.div>
    </section>
  );
}
