"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDownRight, ChevronRight, Radio, Signal, Waves } from "lucide-react";

import { SnowMountainScene } from "@/components/snow-mountain-scene";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { SNOW_MOUNTAIN_FOG_COLOR } from "@/lib/snow-mountain-fog";
import {
  heroHandoffOverlayOpacity,
  heroMidBlockY,
  heroMidCopyOpacity,
  heroMidLineY,
  heroPrimaryCopyOpacity,
  heroPrimaryHeadlineLineY,
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  heroPrimarySubcopyY,
  heroScrollHintOpacity,
} from "@/lib/snow-mountain-hero-scroll";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/** 200vh scroll while mountain is pinned + 100vh sticky layer = 300vh hero. */
const HERO_STICKY_SCROLL_VH = 200;
const HERO_SECTION_VH = HERO_STICKY_SCROLL_VH + 100;

const nav = [
  { href: "/#services", label: "Services" },
  { href: "/#blog", label: "Insights" },
  { href: "/#aboutus", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function SnowMountainNav() {
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-30 px-5 pt-5 sm:px-8 sm:pt-7"
      initial={reduce ? undefined : { opacity: 0, y: -12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease, delay: 0.02 }}
    >
      <div className="relative mx-auto flex max-w-[min(100%,1400px)] items-center justify-between">
        <Link
          href="/"
          className="font-display text-[1.125rem] font-normal tracking-[0.02em] text-[var(--color-heading)] [text-shadow:0_1px_24px_rgba(0,0,0,0.45)] sm:text-lg"
        >
          Telcorepublic
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-white/[0.12] bg-[rgba(8,10,18,0.45)] px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[rgba(242,240,245,0.92)] transition hover:text-[var(--accent-hover)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#contact"
          className="relative z-10 hidden items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-heading)] backdrop-blur-md transition hover:border-white/25 hover:bg-white/[0.1] sm:inline-flex"
        >
          Brief us
          <ChevronRight className="size-3.5 opacity-80" aria-hidden />
        </Link>
      </div>
    </motion.header>
  );
}

export function SnowMountainLanding() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const scrollProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const handoffOverlayOpacity = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroHandoffOverlayOpacity(p),
  );
  const heroCopyOpacity = useTransform(scrollYProgress, (p) =>
    reduce ? 1 : heroPrimaryCopyOpacity(p),
  );
  const heroMidCopyOpacityMotion = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroMidCopyOpacity(p),
  );
  const scrollHintOpacity = useTransform(scrollYProgress, (p) =>
    reduce ? 1 : heroScrollHintOpacity(p),
  );

  const primaryParallaxY = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroPrimaryParallaxY(p),
  );
  const primaryParallaxX = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroPrimaryParallaxX(p),
  );
  const primarySubcopyY = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroPrimarySubcopyY(p),
  );
  const headlineLine0Y = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroPrimaryHeadlineLineY(p, 0),
  );
  const headlineLine1Y = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroPrimaryHeadlineLineY(p, 1),
  );
  const midBlockY = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroMidBlockY(p),
  );
  const midLabelY = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroMidLineY(p, 0),
  );
  const midTitleY = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroMidLineY(p, 1),
  );
  const midBodyY = useTransform(scrollYProgress, (p) =>
    reduce ? 0 : heroMidLineY(p, 2),
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollProgressRef.current = reduce ? 0 : latest;
  });

  useEffect(() => {
    scrollProgressRef.current = reduce ? 0 : scrollYProgress.get();
  }, [reduce, scrollYProgress]);

  return (
    <>
      <section
        ref={heroRef}
        id="summit"
        className="relative isolate z-20"
        style={{
          backgroundColor: SNOW_MOUNTAIN_FOG_COLOR,
          height: `${HERO_SECTION_VH}vh`,
          minHeight: `${HERO_SECTION_VH}vh`,
        }}
      >
        <div className="sticky top-0 z-0 h-dvh min-h-dvh w-full overflow-hidden">
          <div className="absolute inset-0 min-h-dvh">
            <SnowMountainScene scrollProgressRef={scrollProgressRef} />
          </div>

          {/* Readability: cool storm side + depth */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0c2840]/[0.38] via-[#0a2034]/18 to-transparent sm:from-[#0c2840]/32 sm:via-[#081c2c]/14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a1c2e]/22 via-transparent to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_70%_45%,transparent_40%,rgba(12,40,64,0.14)_100%)]"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(42vh,28rem)] bg-gradient-to-t from-[#0c1828] via-[#0a1420]/88 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#08121c] to-transparent opacity-85"
            aria-hidden
          />

          <div className="snow-mountain-hero-film" aria-hidden />

          <motion.div
            className="pointer-events-none absolute inset-0 z-[12] bg-[var(--ice-950)]"
            style={{ opacity: reduce ? 0 : handoffOverlayOpacity }}
            aria-hidden
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col">
          <div className="pointer-events-auto">
            <SnowMountainNav />
          </div>

          <motion.div
            className="pointer-events-auto mx-auto flex min-h-dvh w-full max-w-[min(100%,1400px)] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-24"
            style={{
              opacity: reduce ? 1 : heroCopyOpacity,
              x: primaryParallaxX,
              y: primaryParallaxY,
            }}
          >
          <div className="max-w-2xl">
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.38em] text-[rgba(232,236,242,0.72)] [text-shadow:0_1px_20px_rgba(0,0,0,0.5)]">
              {["Independent", "telecom", "research"].map((word, i) => (
                <span
                  key={word}
                  className={cn(
                    "mr-[0.35em] inline-block last:mr-0",
                    !reduce && "snow-mountain-hero-clip",
                  )}
                  style={
                    { "--clip-delay": `${0.08 + i * 0.06}s` } as CSSProperties
                  }
                >
                  {word}
                </span>
              ))}
            </p>

            <h1 className="mt-5 font-display text-[clamp(2.5rem,7.5vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.03em] text-[var(--color-heading)] [text-shadow:0_4px_48px_rgba(0,0,0,0.55),0_0_1px_rgba(0,0,0,0.8)]">
              <motion.span className="block" style={{ y: headlineLine0Y }}>
                {["Clarity", "above"].map((word, i) => (
                  <span
                    key={word}
                    className={cn(
                      "mr-[0.2em] inline-block last:mr-0",
                      !reduce && "snow-mountain-hero-clip",
                    )}
                    style={
                      { "--clip-delay": `${0.14 + i * 0.08}s` } as CSSProperties
                    }
                  >
                    {word}
                  </span>
                ))}
              </motion.span>
              <motion.span
                className="mt-1 block sm:mt-1.5"
                style={{ y: headlineLine1Y }}
              >
                {["the", "noise", "floor."].map((word, i) => (
                  <span
                    key={word}
                    className={cn(
                      "mr-[0.2em] inline-block bg-gradient-to-r from-[var(--ice-50)] via-[var(--ice-100)] to-[var(--ice-400)] bg-clip-text text-transparent last:mr-0",
                      !reduce && "snow-mountain-hero-clip",
                    )}
                    style={
                      {
                        "--clip-delay": `${0.3 + i * 0.07}s`,
                      } as CSSProperties
                    }
                  >
                    {word}
                  </span>
                ))}
              </motion.span>
            </h1>

            <motion.div style={{ y: primarySubcopyY }}>
              <p className="mt-7 max-w-md text-base font-light leading-[1.75] text-[rgba(228,232,238,0.82)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-[1.05rem]">
                Spectrum, infrastructure, and market intelligence—delivered with the
                precision your stakeholders expect.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/#services"
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.1] px-6 text-sm font-medium text-[var(--color-heading)] backdrop-blur-md transition",
                  "hover:border-white/30 hover:bg-white/[0.16]",
                )}
              >
                View capabilities
                <ArrowDownRight className="size-4 opacity-90" aria-hidden />
              </Link>
              <Link
                href="/#contact"
                className="text-sm font-medium text-[rgba(232,236,242,0.78)] underline-offset-4 transition hover:text-[var(--color-heading)] hover:underline"
              >
                Schedule a briefing
              </Link>
              </div>
            </motion.div>
          </div>

          </motion.div>

          <motion.div
            className="pointer-events-auto mx-auto flex min-h-dvh w-full max-w-[min(100%,1400px)] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-24"
            style={{
              opacity: reduce ? 0 : heroMidCopyOpacityMotion,
              y: midBlockY,
            }}
            aria-hidden={reduce === true ? true : undefined}
          >
            <div className="max-w-2xl">
              <motion.p
                className="font-display text-[11px] font-medium uppercase tracking-[0.32em] text-[rgba(232,236,242,0.68)] [text-shadow:0_1px_20px_rgba(0,0,0,0.5)]"
                style={{ y: midLabelY }}
              >
                Depth without noise
              </motion.p>
              <motion.p
                className="mt-6 max-w-md font-display text-[clamp(1.75rem,4.5vw,2.35rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[var(--color-heading)] [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]"
                style={{ y: midTitleY }}
              >
                Hold the full picture—spectrum, policy, and economics in one coherent frame.
              </motion.p>
              <motion.p
                className="mt-6 max-w-md text-base font-light leading-[1.75] text-[rgba(228,232,238,0.82)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-[1.05rem]"
                style={{ y: midBodyY }}
              >
                As you move through the view, perspective shifts only slightly—enough to feel
                the terrain, not enough to distract from the decision in front of you.
              </motion.p>
            </div>
          </motion.div>

          <div
            className="shrink-0"
            style={{ minHeight: `${HERO_STICKY_SCROLL_VH / 2}vh` }}
            aria-hidden
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-[24] flex justify-center">
          <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-end pb-10 sm:pb-14">
            <motion.div
              className="flex flex-col items-center"
              style={{ opacity: reduce ? 1 : scrollHintOpacity }}
            >
              <a
                href="#signal"
                className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/[0.12] bg-[rgba(8,10,18,0.38)] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[rgba(200,210,224,0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition hover:border-white/22 hover:bg-[rgba(8,10,18,0.52)] hover:text-[rgba(232,236,242,0.95)]"
                aria-label="Scroll to Signal intelligence"
              >
                <span
                  className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(200,210,224,0.45)]"
                  aria-hidden
                />
                <span>Scroll</span>
                <motion.span
                  className="inline-flex text-[rgba(200,210,224,0.55)]"
                  animate={reduce ? undefined : { y: [0, 4, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden
                >
                  <ArrowDownRight className="size-4 rotate-90" />
                </motion.span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="signal"
        className="relative z-0 border-t border-[var(--border-tech)] bg-[var(--ice-950)]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-[var(--ice-800)]/40 to-transparent"
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
            {[
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
            ].map((item, i) => (
              <ScrollReveal key={item.title} from="up" delayMs={80 + i * 70}>
                <article
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border border-[var(--border-tech)] bg-[var(--surface-panel)]/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition",
                    "hover:border-[var(--border-tech-hover)] hover:bg-[var(--surface-panel)]/55",
                  )}
                >
                  <div className="mb-5 inline-flex rounded-xl border border-[var(--border-tech)] bg-[rgba(58,52,68,0.15)] p-2.5 text-[var(--color-heading)]">
                    <item.icon className="size-5" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-medium tracking-[-0.01em] text-[var(--color-heading)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-body)]">
                    {item.body}
                  </p>
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--glow-accent)] opacity-0 blur-2xl transition group-hover:opacity-100" aria-hidden />
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
    </>
  );
}
