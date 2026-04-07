"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowDownRight, ChevronRight } from "lucide-react";

import {
  BrandStatements,
  ContactSection,
  ServicesSection,
} from "@/components/landing/sections";
import { SnowMountainScene } from "@/components/snow-mountain-scene";
import { SnowMountainSignalSection } from "@/components/snow-mountain-signal-section";
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
import { Marquee } from './landing/marquee';
import WorldMap from './ui/world-map';

const ease = [0.22, 1, 0.36, 1] as const;

/** 200vh scroll while mountain is pinned + 100vh sticky layer = 300vh hero. */
const HERO_STICKY_SCROLL_VH = 200;
const HERO_SECTION_VH = HERO_STICKY_SCROLL_VH + 100;

/** Initial custom props for p=0 (avoids unset vars before layout sync). */
const HERO_SCROLL_VARS_INITIAL = {
  "--sm-handoff": "0",
  "--sm-primary-opacity": "1",
  "--sm-mid-opacity": "0",
  "--sm-scroll-hint": "1",
  "--sm-primary-x": "0px",
  "--sm-primary-y": "0px",
  "--sm-subcopy-y": "0px",
  "--sm-h1-0-y": "0px",
  "--sm-h1-1-y": "0px",
  "--sm-mid-block-y": "16px",
  "--sm-mid-label-y": "10px",
  "--sm-mid-title-y": "10px",
  "--sm-mid-body-y": "10px",
} as const satisfies Record<string, string>;

function applyHeroScrollVars(
  el: HTMLElement,
  p: number,
  reduce: boolean | null,
) {
  if (reduce) {
    el.style.setProperty("--sm-handoff", "0");
    el.style.setProperty("--sm-primary-opacity", "1");
    el.style.setProperty("--sm-mid-opacity", "0");
    el.style.setProperty("--sm-scroll-hint", "1");
    el.style.setProperty("--sm-primary-x", "0px");
    el.style.setProperty("--sm-primary-y", "0px");
    el.style.setProperty("--sm-subcopy-y", "0px");
    el.style.setProperty("--sm-h1-0-y", "0px");
    el.style.setProperty("--sm-h1-1-y", "0px");
    el.style.setProperty("--sm-mid-block-y", "0px");
    el.style.setProperty("--sm-mid-label-y", "0px");
    el.style.setProperty("--sm-mid-title-y", "0px");
    el.style.setProperty("--sm-mid-body-y", "0px");
    return;
  }
  el.style.setProperty("--sm-handoff", String(heroHandoffOverlayOpacity(p)));
  el.style.setProperty("--sm-primary-opacity", String(heroPrimaryCopyOpacity(p)));
  el.style.setProperty("--sm-mid-opacity", String(heroMidCopyOpacity(p)));
  el.style.setProperty("--sm-scroll-hint", String(heroScrollHintOpacity(p)));
  el.style.setProperty("--sm-primary-x", `${heroPrimaryParallaxX(p)}px`);
  el.style.setProperty("--sm-primary-y", `${heroPrimaryParallaxY(p)}px`);
  el.style.setProperty("--sm-subcopy-y", `${heroPrimarySubcopyY(p)}px`);
  el.style.setProperty("--sm-h1-0-y", `${heroPrimaryHeadlineLineY(p, 0)}px`);
  el.style.setProperty("--sm-h1-1-y", `${heroPrimaryHeadlineLineY(p, 1)}px`);
  el.style.setProperty("--sm-mid-block-y", `${heroMidBlockY(p)}px`);
  el.style.setProperty("--sm-mid-label-y", `${heroMidLineY(p, 0)}px`);
  el.style.setProperty("--sm-mid-title-y", `${heroMidLineY(p, 1)}px`);
  el.style.setProperty("--sm-mid-body-y", `${heroMidLineY(p, 2)}px`);
}

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
          className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center rounded-xl px-1.5 py-1.5 backdrop-blur-3xl md:flex bg-white/20"
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


      </div>
    </motion.header>
  );
}

export function SnowMountainLanding() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef(0);
  /** Viewport coordinates — `fixed` glow so it paints above the z-20 copy layer. */
  const [heroCursor, setHeroCursor] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    if (reduce) {
      setHeroCursor(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const el = heroCanvasRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        setHeroCursor(null);
        return;
      }
      setHeroCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    scrollProgressRef.current = reduce ? 0 : p;
    const el = heroRef.current;
    if (el) applyHeroScrollVars(el, p, reduce);
  });

  useLayoutEffect(() => {
    const p = scrollYProgress.get();
    scrollProgressRef.current = reduce ? 0 : p;
    const el = heroRef.current;
    if (el) applyHeroScrollVars(el, p, reduce);
  }, [reduce, scrollYProgress]);

  return (
    <>
      <section
        ref={heroRef}
        id="summit"
        className="relative isolate z-20 [--color-heading:#f4fbff] [--accent-hover:#a5f3fc]"
        style={{
          backgroundColor: SNOW_MOUNTAIN_FOG_COLOR,
          height: `${HERO_SECTION_VH}vh`,
          minHeight: `${HERO_SECTION_VH}vh`,
          ...HERO_SCROLL_VARS_INITIAL,
        }}
      >
        <div className="sticky top-0 z-0 h-dvh min-h-dvh w-full overflow-hidden">
          <div
            ref={heroCanvasRef}
            className={cn(
              "absolute inset-0 min-h-dvh",
              !reduce && "cursor-none",
            )}
          >
            <SnowMountainScene
              scrollProgressRef={scrollProgressRef}
              className={!reduce ? "cursor-none" : undefined}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(42vh,28rem)] bg-gradient-to-t from-[#0c1828] via-[#0a1420]/88 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#08121c] to-transparent opacity-85"
            aria-hidden
          />

          <div className="snow-mountain-hero-film" aria-hidden />

          {/* <div
            className="pointer-events-none absolute inset-0 z-[12] bg-[var(--bg)]"
            style={{ opacity: "var(--sm-handoff)" }}
            aria-hidden
          /> */}
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-20 flex flex-col",
            !reduce && "cursor-none [&_a]:cursor-pointer",
          )}
        >
          <div className="pointer-events-auto">
            <SnowMountainNav />
          </div>

          <div
            className="pointer-events-auto mx-auto flex min-h-dvh w-full max-w-[min(100%,1400px)] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-24"
            style={{
              opacity: "var(--sm-primary-opacity)",
              transform:
                "translate3d(var(--sm-primary-x), var(--sm-primary-y), 0)",
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
                <span
                  className="block"
                  style={{ transform: "translateY(var(--sm-h1-0-y))" }}
                >
                  {["Navigating", "the", "shift."].map((word, i) => (
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
                </span>
                <span
                  className="mt-1 block sm:mt-1.5"
                  style={{ transform: "translateY(var(--sm-h1-1-y))" }}
                >
                  {["Leading", "the", "Techco", "Revolution"].map((word, i) => (
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
                </span>
              </h1>

              <div style={{ transform: "translateY(var(--sm-subcopy-y))" }}>
                <p className="mt-7 max-w-md text-base font-light leading-[1.75] text-[rgba(228,232,238,0.82)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-[1.05rem]">
                  Fact-Based Research.
                  Actionable Disruption.
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
              </div>
            </div>

          </div>

          <div
            className="pointer-events-auto mx-auto flex min-h-dvh w-full max-w-[min(100%,1400px)] flex-col items-end justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-24"
            style={{
              opacity: "var(--sm-mid-opacity)",
              transform: "translateY(var(--sm-mid-block-y))",
            }}
            aria-hidden={reduce === true ? true : undefined}
          >
            <div className="max-w-md text-right">
              <p
                className="font-display text-[11px] font-medium uppercase tracking-[0.32em] text-[rgba(232,236,242,0.68)] [text-shadow:0_1px_20px_rgba(0,0,0,0.5)]"
                style={{ transform: "translateY(var(--sm-mid-label-y))" }}
              >
                Depth without noise
              </p>
              <p
                className="mt-6 ml-auto max-w-md font-display text-[clamp(1.75rem,4.5vw,2.35rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[var(--color-heading)] [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]"
                style={{ transform: "translateY(var(--sm-mid-title-y))" }}
              >
                Crossing the Telco Chasm
              </p>
              <p
                className="mt-6 ml-auto max-w-md text-base font-light leading-[1.75] text-[rgba(228,232,238,0.82)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-[1.05rem]"
                style={{ transform: "translateY(var(--sm-mid-body-y))" }}
              >
                We are the go-to, thought-provoking market research and advisory firm in the new telecommunications software market.
              </p>
            </div>
          </div>

          <div
            className="shrink-0"
            style={{ minHeight: `${HERO_STICKY_SCROLL_VH / 2}vh` }}
            aria-hidden
          />
        </div>

        {!reduce && heroCursor != null ? (
          <div
            className="pointer-events-none fixed z-[25] size-[min(22vw,9.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={
              {
                left: heroCursor.x,
                top: heroCursor.y,
                background:
                  "radial-gradient(circle, rgba(255,250,240,0.78) 0%, rgba(210,235,255,0.28) 38%, transparent 72%)",
                mixBlendMode: "screen",
                boxShadow:
                  "0 0 34px 15px rgba(255,252,248,0.24), inset 0 0 20px rgba(255,255,255,0.38)",
              } as CSSProperties
            }
            aria-hidden
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-[24] flex justify-center">
          <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-end pb-10 sm:pb-14">
            <div
              className="flex flex-col items-center"
            >
              <a
                href="#signal"
                className="pointer-events-auto flex items-center gap-3 rounded-full  text-white/70 text-[10px] font-medium tracking-[0.28em] uppercase animate-pulse duration-900"
                aria-label="Scroll to Signal intelligence"
              >
                <span
                  className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(200,210,224,0.45)]"
                  aria-hidden
                />
                <span>Scroll</span>

              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="theme-snow-ice relative border-t border-cyan-500/20 bg-gradient-to-b from-[#f2f9ff] via-[#f2f9ff] to-[#f2f9ff]">
        {/* <Marquee /> */}
        <WorldMap />
        <ServicesSection />
        <ContactSection />
      </div>
    </>
  );
}
