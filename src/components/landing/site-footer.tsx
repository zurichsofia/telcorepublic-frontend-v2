"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const linkStagger = 0.06;

const links = [
  { href: "#research", label: "Research" },
  { href: "#methodology", label: "Methodology" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteFooter() {
  const reduce = useReducedMotion();

  return (
    <footer className="relative z-[2] overflow-hidden border-t border-[rgba(255,255,255,0.06)] px-5 py-14 sm:px-8">
      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between"
        initial={reduce ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease }}
      >
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-black">
            Telcorepublic
          </p>
          <p className="mt-2 max-w-xs text-xs font-light leading-relaxed text-[var(--color-clouds)]">
            Independent research for the people who design, regulate, and invest in
            connectivity.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm" aria-label="Footer">
          {links.map((item, i) => (
            <motion.div
              key={item.href}
              initial={reduce ? undefined : { opacity: 0, y: 8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * linkStagger, ease }}
            >
              <Link
                href={item.href}
                className="text-xs font-light text-[var(--color-clouds)] transition hover:text-black"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>
      <motion.p
        className="relative mx-auto mt-14 max-w-6xl border-t border-[rgba(255,255,255,0.06)] pt-6 text-xs font-light text-slate-900"
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
      >
        © {new Date().getFullYear()} Telcore Research. Video: peaks and alpine
        landscape - used for demonstration.
      </motion.p>
    </footer>
  );
}
