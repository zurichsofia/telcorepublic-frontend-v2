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
  const segment = CLIENTS.join(" · ");
  const group = Array(6).fill(segment).join(" · ");
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative overflow-hidden border-t border-slate-200/40 py-7 sm:py-8"
      initial={reduce ? undefined : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="animate-marquee flex w-max">
          <span className="shrink-0 pr-10 text-base font-normal leading-none text-[var(--color-label)] sm:pr-14 sm:text-lg">
            {group}
          </span>
          <span
            className="shrink-0 pr-10 text-base font-normal leading-none text-[var(--color-label)] sm:pr-14 sm:text-lg"
            aria-hidden
          >
            {group}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
