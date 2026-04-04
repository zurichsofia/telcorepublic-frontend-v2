import Link from "next/link";
import { VideoBackground } from "./video-background";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <VideoBackground />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#050608]/55 via-[#050608]/45 to-[#050608]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(124,184,255,0.12),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col justify-end px-5 pb-24 pt-32 sm:px-8 sm:pb-32 md:justify-center md:pb-28 md:pt-40">
        <p className="animate-fade-up mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#7cb8ff]">
          Independent telecom research
        </p>
        <h1 className="animate-fade-up delay-100 font-[family-name:var(--font-display)] text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.05] tracking-[-0.02em] text-[#f4f2ed]">
          Where rigor meets the network edge
        </h1>
        <p className="animate-fade-up delay-200 mt-6 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
          We model spectrum, infrastructure, and demand — so operators, regulators,
          and builders can see what is coming before the signal arrives.
        </p>
        <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="#research"
            className="inline-flex rounded-full bg-[#f4f2ed] px-7 py-3.5 text-sm font-semibold text-[#050608] transition hover:bg-white"
          >
            Learn more
          </Link>
          <Link
            href="#contact"
            className="inline-flex rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/35 hover:bg-white/[0.08]"
          >
            Partner with us
          </Link>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/35 to-transparent" />
      </div>
    </section>
  );
}
