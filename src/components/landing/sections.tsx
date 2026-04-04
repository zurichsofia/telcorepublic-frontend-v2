import Link from "next/link";

import { ScrollReveal } from "@/components/landing/scroll-reveal";

const pillars = [
  {
    tag: "Spectrum & policy",
    title: "Regulatory foresight",
    body: "Scenario models for auctions, sharing, and national rollouts — aligned to how decisions are actually made.",
  },
  {
    tag: "Network economics",
    title: "CAPEX that compounds",
    body: "Capacity planning tied to real traffic shapes, not slide-deck optimism. Built for finance and engineering together.",
  },
  {
    tag: "Field truth",
    title: "Measurements you can trust",
    body: "Drive tests, probes, and synthetic workloads — reproducible methods, peer-reviewable results.",
  },
];

const methodology = [
  {
    title: "Hypothesis first",
    body: "We start from falsifiable claims and publish assumptions — so findings can be challenged and improved.",
  },
  {
    title: "Open methods",
    body: "Where we can share methodology and code, we do. Reproducibility is part of the deliverable.",
  },
  {
    title: "Operator-grade rigor",
    body: "Our team has shipped and studied networks at scale. Research is written for people who run the grid.",
  },
];

const insights = [
  {
    title: "White papers",
    desc: "Deep dives on RAN evolution, fiber economics, and edge compute placement.",
  },
  {
    title: "Briefings",
    desc: "Quarterly outlooks for investors and strategy teams — concise, sourced, actionable.",
  },
  {
    title: "Labs",
    desc: "Collaborative experiments with vendors and universities on next-gen protocols.",
  },
];

export function IntroSection() {
  return (
    <section id="research" className="relative">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-label)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
          Your research partner
        </p>
        <h2 className="font-display mt-4 max-w-3xl text-4xl font-normal leading-[1.2] tracking-tight text-[var(--color-heading)] sm:text-5xl [text-shadow:0_2px_30px_rgba(0,0,0,0.7),0_0_60px_rgba(0,0,0,0.4)]">
          Networks that stay honest under load
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-body)]">
          Telcorepublic is an independent research practice focused on telecommunications
          infrastructure, radio systems, and the economics of connectivity. We help
          you see trade-offs before they become outages or stranded assets.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="group rounded-2xl border border-[rgba(120,160,210,0.12)] bg-[rgba(8,14,28,0.55)] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-[16px] transition hover:border-[rgba(120,160,210,0.3)] hover:bg-[rgba(15,25,50,0.45)]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {p.tag}
              </p>
              <h3 className="font-display mt-4 text-[1.375rem] font-normal tracking-tight text-[var(--color-heading)] [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]">
                {p.title}
              </h3>
              <p className="mt-3 text-[13px] font-light leading-[1.7] text-[var(--color-body)]">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MethodologySection() {
  return (
    <section
      id="methodology"
      className="border-t border-[rgba(140,180,120,0.08)] bg-[#000000]"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-label)] opacity-80 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
              How we work
            </p>
            <h2 className="font-display mt-4 text-4xl font-normal tracking-tight text-[var(--color-heading)] sm:text-[2.75rem] [text-shadow:0_2px_30px_rgba(0,0,0,0.7)]">
              Methodology you can audit
            </h2>
            <p className="mt-5 max-w-md text-base font-light leading-relaxed text-[var(--color-body)]">
              From lab benchmarks to national models, every engagement is documented
              so your technical and executive stakeholders share one picture of risk
              and opportunity.
            </p>
            <Link
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[rgba(140,180,220,0.35)] bg-[rgba(15,25,50,0.4)] px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--color-accent)] backdrop-blur-[10px] transition hover:border-[rgba(140,180,220,0.55)] hover:bg-[rgba(30,50,90,0.5)]"
            >
              Request a scope
            </Link>
          </div>
          <ul className="space-y-6">
            {methodology.map((m) => (
              <li
                key={m.title}
                className="rounded-2xl border border-[rgba(120,160,210,0.1)] bg-[rgba(8,14,28,0.45)] p-7 backdrop-blur-sm"
              >
                <h3 className="font-display text-xl font-normal tracking-tight text-[var(--color-heading)]">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-[var(--color-body)]">
                  {m.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function StatementBand() {
  return (
    <section className="relative overflow-hidden border-y border-[rgba(140,180,120,0.08)] py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(255,180,100,0.07),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl space-y-20 px-5 sm:space-y-28 sm:px-8 lg:space-y-60">
        <ScrollReveal from="right" className="ml-auto w-full max-w-xl sm:max-w-2xl">
          <h2 className="font-display text-right text-[clamp(1.75rem,4.5vw,3rem)] font-normal italic leading-[1.3] tracking-tight text-[var(--color-heading)] [text-shadow:0_2px_30px_rgba(0,0,0,0.7)]">
            Crossing the Telco Chasm
          </h2>
          <p className="mt-8 max-w-xl text-right text-lg font-light leading-relaxed text-[var(--color-body)] sm:ml-auto">
            We are the go-to, thought-provoking market research and advisory firm in
            the new telecommunications software market.
          </p>
        </ScrollReveal>

        <ScrollReveal from="left" delayMs={80} className="mr-auto w-full max-w-xl sm:max-w-2xl">
          <h2 className="font-display text-left text-[clamp(1.75rem,4.5vw,3rem)] font-normal italic leading-[1.3] tracking-tight text-[var(--color-heading)] [text-shadow:0_2px_30px_rgba(0,0,0,0.7)]">
            Our Mission
          </h2>
          <p className="mt-8 max-w-xl text-left text-lg font-light leading-relaxed text-[var(--color-body)]">
            We track ongoing disruption and innovation related to telecommunications
            business and operations.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function InsightsSection() {
  return (
    <section id="insights" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-label)] opacity-90">
            Outputs
          </p>
          <h2 className="font-display mt-3 text-4xl font-normal tracking-tight text-[var(--color-heading)] sm:text-5xl">
            Insights &amp; collaboration
          </h2>
        </div>
        <Link
          href="#contact"
          className="shrink-0 rounded-full border border-[rgba(140,180,220,0.35)] bg-[rgba(15,25,50,0.4)] px-6 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-accent)] backdrop-blur-[10px] transition hover:border-[rgba(140,180,220,0.55)] hover:bg-[rgba(30,50,90,0.5)]"
        >
          Start a conversation
        </Link>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {insights.map((i) => (
          <article
            key={i.title}
            className="flex flex-col rounded-2xl border border-[rgba(120,160,210,0.12)] bg-[rgba(8,14,28,0.4)] p-8 backdrop-blur-sm"
          >
            <h3 className="font-display text-2xl font-normal tracking-tight text-[var(--color-heading)]">
              {i.title}
            </h3>
            <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-[var(--color-body)]">
              {i.desc}
            </p>
            <span className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-label)] opacity-60">
              Available on request
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="border-t border-[rgba(140,180,120,0.08)] bg-gradient-to-b from-[#000000] to-[#000000] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-label)]">
          Telcore Research
        </p>
        <h2 className="font-display mt-4 text-4xl font-normal tracking-tight text-[var(--color-heading)] sm:text-5xl">
          Build on{" "}
          <em className="text-[var(--color-accent)] [text-shadow:0_0_30px_rgba(255,180,100,0.35)]">
            evidence
          </em>
        </h2>
        <p className="mt-5 text-base font-light text-[var(--color-body)]">
          Share your timeline and constraints — we will respond with a clear view of
          what we can prove, model, or measure together.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:hello@telcore.example"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(140,180,220,0.35)] bg-[rgba(15,25,50,0.4)] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-accent)] backdrop-blur-[10px] transition hover:border-[rgba(140,180,220,0.55)] hover:bg-[rgba(30,50,90,0.5)]"
          >
            hello@telcore.example
          </a>
          <a
            href="#research"
            className="inline-flex rounded-full border border-[rgba(140,180,220,0.22)] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(215,230,190,0.65)] transition hover:border-[rgba(140,180,220,0.4)] hover:text-[var(--accent-hover)]"
          >
            Back to top
          </a>
        </div>
      </div>
    </section>
  );
}
