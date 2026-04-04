import Link from "next/link";
import type { SVGProps } from "react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";

const reasons = [
  {
    title: "Decades of Industry Experience",
    body: "We have worked for leading global analyst research firms, such as Gartner, for decades. We have worked in the industry and followed its market evolution since the 1990s.",
    Icon: IconStarburst,
  },
  {
    title: "Personalized, Responsive and Collaborative",
    body: "Our services are personalized and flexible, at an attractive price/performance ratio.",
    Icon: IconOrbits,
  },
  {
    title: "Comprehensive Insights",
    body: "We have supported hundreds of global operators, vendors, investors and tech startups.",
    Icon: IconOverlap,
  },
  {
    title: "Reliable Methodology",
    body: "We have developed industry models, benchmarks and best practices for users and suppliers to support digital transformation and change management.",
    Icon: IconLayers,
  },
  {
    title: "Objective, Unbiased, Fact-based",
    body: "Our mission is to provide unbiased, fact-based and in-depth insights in conjunction with strategic advice.",
    Icon: IconBalance,
  },
  {
    title: "Extensive Network",
    body: "Industry leaders rely on our insights and advice. We maintain a strong Senior Executive and C-Level network on a global basis.",
    Icon: IconGlobe,
  },
] as const;

function IconStarburst(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="16"
          y1="16"
          x2={16 + Math.cos((i * Math.PI) / 4) * 12}
          y2={16 + Math.sin((i * Math.PI) / 4) * 12}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function IconOrbits(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <ellipse
        cx="16"
        cy="16"
        rx="11"
        ry="5"
        stroke="currentColor"
        strokeWidth="1"
        transform="rotate(-22 16 16)"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="7"
        ry="3.5"
        stroke="currentColor"
        strokeWidth="1"
        transform="rotate(18 16 16)"
      />
    </svg>
  );
}

function IconOverlap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <circle cx="13" cy="14" r="6" stroke="currentColor" strokeWidth="1" />
      <circle cx="19" cy="14" r="6" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="18" r="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IconLayers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path
        d="M6 12 16 7l10 5-10 5L6 12Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M6 17 16 12l10 5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M6 22 16 17l10 5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBalance(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path
        d="M16 8v14M8 24h16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M10 14h4l-2 5M18 14h4l2 5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1" />
      <ellipse
        cx="16"
        cy="16"
        rx="4"
        ry="10"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M8 12c2.8 1.2 5.2 1.8 8 1.8s5.2-.6 8-1.8M8 20c2.8-1.2 5.2-1.8 8-1.8s5.2.6 8 1.8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhyTelcoRepublicSection() {
  return (
    <section
      id="why"
      className="relative overflow-hidde"
      aria-labelledby="why-telco-republic-heading"
    >
      <div className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
        <ScrollReveal from="up" className="max-w-3xl">
          <header>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--color-label)]">
              Why Telco Republic
            </p>
            <h2
              id="why-telco-republic-heading"
              className="font-display mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--color-heading)]"
            >
              Unbiased insight for telecom strategy.
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-[var(--color-body)] sm:text-[1.05rem]">
              Six reasons teams work with us — research-grade rigor with operator
              context.
            </p>
          </header>
        </ScrollReveal>

        <ul className="mt-20 grid list-none grid-cols-1 gap-x-10 gap-y-14 p-0 md:grid-cols-2 md:gap-x-12 lg:gap-y-16">
          {reasons.map((item, index) => {
            const { Icon } = item;
            return (
              <li key={item.title}>
                <ScrollReveal
                  from="up"
                  delayMs={index * 50}
                  className="h-full"
                >
                  <article className="flex h-full flex-col">
                    <div className="text-[var(--color-heading)]">
                      <Icon className="h-11 w-11 shrink-0 opacity-95" />
                    </div>
                    <h3 className="font-display mt-6 text-[1.35rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--color-heading)] sm:text-2xl sm:leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] font-light leading-[1.75] text-[var(--color-body)] sm:text-base">
                      {item.body}
                    </p>
                  </article>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>

        <ScrollReveal
          from="up"
          delayMs={80}
          className="mt-20 flex flex-col items-start gap-6 border-t border-[rgba(255,255,255,0.08)] pt-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-md text-sm font-light leading-relaxed text-[var(--color-body)]">
            Ready to pressure-test a roadmap or benchmark a vendor landscape?
          </p>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] px-6 py-3 text-sm font-medium text-[var(--color-heading)] transition motion-safe:hover:translate-x-0.5 hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.12)]"
          >
            Start a conversation
            <span
              aria-hidden
              className="text-[var(--color-label)] transition-transform motion-safe:group-hover:translate-x-0.5 group-hover:text-[var(--color-heading)]"
            >
              ↗
            </span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
