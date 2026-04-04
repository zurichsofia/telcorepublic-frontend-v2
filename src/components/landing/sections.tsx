import Link from "next/link";

import { ScrollReveal } from "@/components/landing/scroll-reveal";


const services = [
  {
    title: "Disrupter Quadrants",
    desc: "Evaluate and compare vendors that specialize in innovation and disruption in emerging next-generation telecom operations and business support systems.",
  },
  {
    title: "Competitive Positioning",
    desc: "Differentiate yourself with SWOTs, best practices, benchmarking, whitepapers and roadmap evaluations.",
  },
  {
    title: "Go-To-Market",
    desc: "Refine your strategy with workshops, lead generation, RFP/RFI support, partner matchmaking, inquiry support and briefings.",
  },
  {
    title: "Market Assessment",
    desc: "Advance your business with addressable market insights, market entry evaluations, market segmentation and emerging vendors insights.",
  },
  {
    title: "Custom Research",
    desc: "Gain in-depth insights tailored toward your individual requirements with our personalized custom research services.",
  },
  {
    title: "Subscription",
    desc: "Always be up-to-speed with recurring insights and real-time access to industry experts.",
  },
];

export function BrandStatements() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
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

export function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-label)] opacity-90">
            What we offer
          </p>
          <h2 className="font-display mt-3 text-4xl font-normal tracking-tight text-[var(--color-heading)] sm:text-5xl">
            Our Services
          </h2>
        </div>
        <Link
          href="#contact"
          className="shrink-0 rounded-full border border-[rgba(140,180,220,0.35)] bg-[rgba(15,25,50,0.4)] px-6 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-accent)] backdrop-blur-[10px] transition hover:border-[rgba(140,180,220,0.55)] hover:bg-[rgba(30,50,90,0.5)]"
        >
          Start a conversation
        </Link>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article
            key={s.title}
            className="flex flex-col rounded-2xl border border-[rgba(120,160,210,0.12)] bg-[rgba(8,14,28,0.4)] p-8 backdrop-blur-sm"
          >
            <h3 className="font-display text-2xl font-normal tracking-tight text-[var(--color-heading)]">
              {s.title}
            </h3>
            <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-[var(--color-body)]">
              {s.desc}
            </p>
            <Link
              href="#contact"
              className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)] transition hover:text-[var(--accent-hover)]"
            >
              Learn more
            </Link>
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
