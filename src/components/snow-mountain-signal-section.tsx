"use client";

import Link from "next/link";
import { ChevronRight, Radio, Signal, Waves } from "lucide-react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { cn } from "@/lib/utils";

const pillars = [
  {
    icon: Radio,
    title: "Spectrum & policy",
    body: "Auction dynamics, licensing, and cross-border frameworks—mapped to your risk horizon.",
  },
  {
    icon: Signal,
    title: "Network economics",
    body: "CAPEX paths, vendor landscapes, and performance benchmarks you can defend in the room.",
  },
  {
    icon: Waves,
    title: "Foresight streams",
    body: "Scenario labs and monitoring that turn volatility into a structured point of view.",
  },
] as const;

export function SnowMountainSignalSection() {
  return (
    <section
      id="signal"
      className="relative z-0 border-t"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[min(100%,1200px)] px-5 pb-28 pt-16 sm:px-8 sm:pb-36 sm:pt-20 lg:px-10">
        <ScrollReveal from="up" className="max-w-2xl">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--color-label)]">
            Signal intelligence
          </p>
          <h2 className="mt-4 font-display text-3xl font-normal leading-[1.15] tracking-[-0.02em] text-[var(--color-heading)] sm:text-4xl lg:text-[2.65rem]">
            From raw data to board-ready narrative.
          </h2>
          <p className="mt-6 max-w-xl text-base font-light leading-[1.75] text-[var(--color-body)]">
            We combine proprietary models with on-the-ground context so operators,
            investors, and policymakers can act—without sacrificing rigor.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-3 sm:gap-6">
          {pillars.map((item, i) => (
            <ScrollReveal key={item.title} from="up" delayMs={80 + i * 70}>
              <article
                className={cn(
                  "group relative h-full overflow-hidden rounded-2xl border border-[var(--border-tech)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition",
                  "hover:border-[var(--border-tech-hover)]",
                )}
              >
                <div className="mb-5 inline-flex rounded-xl border border-[var(--border-tech)] p-2.5 text-[var(--color-heading)]">
                  <item.icon className="size-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="font-display text-lg font-medium tracking-[-0.01em] text-[var(--color-heading)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-body)]">
                  {item.body}
                </p>
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--glow-accent)] opacity-0 blur-2xl transition group-hover:opacity-100"
                  aria-hidden
                />
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal from="up" delayMs={120} className="mt-16 sm:mt-20">
          <div className="flex flex-col items-start justify-between gap-6 border-t border-[var(--border-tech)] pt-10 sm:flex-row sm:items-center">
            <p className="max-w-md text-sm font-light text-[var(--color-label)]">
              This block is a sample handoff—your mountain hero should ease into
              content with the same temperature and restraint.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-heading)] transition hover:text-[var(--accent-hover)]"
            >
              Start a conversation
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
