"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "#research", label: "Research" },
  { href: "#methodology", label: "Methodology" },
  { href: "#insights", label: "Insights" },
  { href: "#contact", label: "Contact" },
];

function ArrowIcon({ className }: { className?: string; }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroGlassNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute inset-x-0 top-0 z-20 px-5 pt-5 sm:px-8 sm:pt-7">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="shrink-0 text-[1.05rem] font-semibold tracking-tight text-white sm:text-lg"
        >
          Telcorepublic
        </Link>

        <nav
          className="hidden items-center rounded-full border border-white/10 bg-white/10 px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-black px-1.5 py-1.5 pl-5 text-sm font-semibold text-white shadow-lg shadow-black/30 sm:inline-flex"
          >
            <span>Sign up</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
              <ArrowIcon className="h-4 w-4" />
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md md:hidden"
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
          className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/90"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* <Link
              href="#contact"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Sign up
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                <ArrowIcon className="h-4 w-4" />
              </span>
            </Link> */}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
