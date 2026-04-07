"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Tailwind-style glass: translucent surface + `backdrop-blur-sm` (see Tailwind backdrop-blur docs). */
const glassPanel = "";
// "bg-white/20 shadow-xs backdrop-blur-md";

const nav = [
  { href: "#home", label: "Home" },
  { href: "#blog", label: "Blog" },
  { href: "#aboutus", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function HeroGlassNav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-x-0 top-0 z-20 px-5 pt-5 sm:px-8 sm:pt-7"
      initial={reduce ? undefined : { opacity: 0, y: -14 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease, delay: 0.04 }}
    >
      <div className="relative flex items-center justify-between">
        <Link
          href="/"
          className="relative z-10 font-display shrink-0 text-[1.125rem] font-normal tracking-[0.02em] text-[var(--color-heading)] sm:text-lg"
        >
          Telcorepublic
        </Link>

        <nav
          className={`absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center rounded-lg px-1.5 py-1.5 md:flex ${glassPanel}`}
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] hover:text-[#001538] transition text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-2">

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-nav-muted)] transition hover:bg-white/15 md:hidden ${glassPanel}`}
            aria-expanded={open}
            aria-controls="hero-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="hero-mobile-nav"
          className={`mt-4 overflow-hidden rounded-2xl p-4 ${glassPanel} md:hidden`}
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-[#001538] transition hover:text-[var(--accent-hover)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </motion.div>
  );
}
