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
      className="relative overflow-hidden border-y border-[rgba(140,180,220,0.1)] bg-[rgba(6,12,24,0.35)] py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      initial={reduce ? undefined : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <p
        className="animate-drift whitespace-nowrap text-sm font-light text-[rgba(180,210,235,0.28)] sm:text-lg"
        aria-hidden
      >
        {repeated}
      </p>
    </motion.div>
  );
}
