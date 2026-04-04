import Link from "next/link";

import { ScrollReveal } from "@/components/landing/scroll-reveal";

const reasons = [
  {
    title: "Decades of Industry Experience",
    body: "We have worked for leading global analyst research firms, such as Gartner, for decades. We have worked in the industry and followed its market evolution since the 1990s.",
  },
  {
    title: "Personalized, Responsive and Collaborative",
    body: "Our services are personalized and flexible, at an attractive price/performance ratio.",
  },
  {
    title: "Comprehensive Insights",
    body: "We have supported hundreds of global operators, vendors, investors and tech startups.",
  },
  {
    title: "Reliable Methodology",
    body: "We have developed industry models, benchmarks and best practices for users and suppliers to support digital transformation and change management.",
  },
  {
    title: "Objective, Unbiased, Fact-based",
    body: "Our mission is to provide unbiased, fact-based and in-depth insights in conjunction with strategic advice.",
  },
  {
    title: "Extensive Network",
    body: "Industry leaders rely on our insights and advice. We maintain a strong Senior Executive and C-Level network on a global basis.",
  },
] as const;

export function WhyTelcoRepublicSection() {
  return (
    <section
      id="why"
      className="relative overflow-hidden border-y border-[rgba(255,255,255,0.06)]"
      aria-labelledby="why-telco-republic-heading"
    >
      <div className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
        <ScrollReveal from="up" className="max-w-3xl">
          <header>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-label)]">
              Why Telco Republic
            </p>
            <h2
              id="why-telco-republic-heading"
              className="font-display mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[var(--color-heading)]"
            >
              Built on depth, not decks.
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-[var(--color-body)] sm:text-[1.05rem]">
              Six reasons teams work with us — research-grade rigor with operator
              context.
            </p>
          </header>
        </ScrollReveal>

        <ol className="mt-20 list-none space-y-0 border-t border-[rgba(255,255,255,0.06)]">
          {reasons.map((item, index) => {
            const n = String(index + 1).padStart(2, "0");
            return (
              <li
                key={item.title}
                className="border-b border-[rgba(255,255,255,0.06)]"
              >
                <ScrollReveal
                  from={index % 2 === 0 ? "left" : "right"}
                  delayMs={index * 45}
                >
                  <article className="group relative py-12 sm:py-14 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:gap-y-3">
                    <div className="pointer-events-none absolute inset-y-3 left-0 w-px bg-gradient-to-b from-[rgba(255,180,100,0.45)] via-[rgba(255,180,100,0.12)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="lg:col-span-4 lg:pt-1">
                      <span
                        className="font-display text-[clamp(2.5rem,6vw,4rem)] font-normal tabular-nums leading-none tracking-tight text-[rgba(255,180,100,0.16)] transition-colors duration-500 group-hover:text-[rgba(255,180,100,0.28)]"
                        aria-hidden
                      >
                        {n}
                      </span>
                      <h3 className="font-display mt-6 max-w-md text-[1.35rem] font-normal leading-snug tracking-[-0.02em] text-[var(--color-heading)] sm:text-2xl sm:leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-6 max-w-2xl text-[15px] font-light leading-[1.75] text-[var(--color-body)] sm:text-base lg:col-span-8 lg:mt-0 lg:self-end lg:pb-1">
                      {item.body}
                    </p>
                  </article>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>

        <ScrollReveal
          from="up"
          delayMs={80}
          className="mt-16 flex flex-col items-start gap-6 border-t border-[rgba(255,255,255,0.06)] pt-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-md text-sm font-light leading-relaxed text-[var(--color-body)]">
            Ready to pressure-test a roadmap or benchmark a vendor landscape?
          </p>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-6 py-3 text-sm font-medium text-[var(--color-heading)] backdrop-blur-sm transition motion-safe:hover:translate-x-0.5 hover:border-[rgba(255,180,100,0.35)] hover:bg-[rgba(255,255,255,0.06)]"
          >
            Start a conversation
            <span
              aria-hidden
              className="text-[var(--color-accent)] transition-transform motion-safe:group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
