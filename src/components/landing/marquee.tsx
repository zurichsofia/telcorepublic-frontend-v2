"use client";

import { motion, useReducedMotion } from "motion/react";

const CLIENTS = [
  "HPE",
  "AWS",
  "Netcracker",
  "Kloudville",
  "Symphonica",
  "Intraway",
] as const;

export function Marquee() {
  const clients = CLIENTS.join(" · ");
  const line = `${clients}`;
  const repeated = Array(12).fill(line).join(" ");
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative overflow-hidden border-y border-[rgba(140,180,220,0.1)] bg-black/25 py-4 backdrop-blur-[2px]"
      initial={reduce ? undefined : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent"
        aria-hidden
      />
      <p
        className="animate-drift whitespace-nowrap text-sm font-light text-[rgba(180,210,235,0.28)] sm:text-lg"
        aria-hidden
      >
        {repeated}
      </p>
    </motion.div>
  );
}
