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
export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative mx-auto max-w-6xl overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(60%,28rem)] bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(56,189,248,0.1),transparent_65%)]"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <ScrollReveal from="up" className="max-w-2xl">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-label)] opacity-95">
              What we offer
            </p>
            <h2 className="font-display mt-3 bg-gradient-to-r from-slate-900 via-cyan-900 to-cyan-700 bg-clip-text text-4xl font-normal tracking-tight text-transparent sm:text-5xl">
              Our Services
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal from="right" delayMs={80} className="sm:self-end">
          <Link
            href="#contact"
            className="inline-flex shrink-0 rounded-full border border-cyan-600/25 bg-white px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)] shadow-sm transition hover:border-cyan-600/40 hover:bg-sky-50/90"
          >
            Start a conversation
          </Link>
        </ScrollReveal>
      </div>
      <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <ScrollReveal
            key={s.title}
            from={i % 2 === 0 ? "up" : "left"}
            delayMs={i * 55}
            className="h-full"
          >
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sky-200/80 bg-white/90 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md transition-[border-color,box-shadow,transform] duration-500 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:border-cyan-400/50 motion-safe:hover:shadow-[0_20px_50px_-24px_rgba(14,116,144,0.12)]">
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-sky-200/40 blur-3xl transition duration-500 group-hover:bg-cyan-200/45"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent opacity-0 transition group-hover:opacity-100"
                aria-hidden
              />
              <h3 className="relative font-display text-2xl font-normal tracking-tight text-[var(--color-heading)] transition-opacity duration-300 group-hover:opacity-85">
                {s.title}
              </h3>
              <p className="relative mt-3 flex-1 text-sm font-light leading-relaxed text-[var(--color-body)]">
                {s.desc}
              </p>
              <Link
                href="#contact"
                className="relative mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] transition hover:text-[var(--accent-hover)]"
              >
                Learn more
              </Link>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[var(--border-subtle)] px-5 py-24 sm:px-8 sm:py-32"
    >
      <ScrollReveal
        from="up"
        blur
        className="relative mx-auto max-w-2xl text-center"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-label)]">
          Telcore Research
        </p>
        <h2 className="font-display mt-4 text-4xl font-normal tracking-tight text-[var(--color-heading)] sm:text-5xl">
          Build on{" "}
          <em className="text-[var(--color-accent)] [text-shadow:0_0_30px_var(--glow-accent)]">
            evidence
          </em>
        </h2>
        <p className="mt-5 text-base font-light text-[var(--color-body)]">
          Share your timeline and constraints — we will respond with a clear view of
          what we can prove, model, or measure together.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {/* <a
            href="mailto:hello@telcore.example"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-tech-strong)] bg-[var(--surface-panel)] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-accent)] transition motion-safe:hover:scale-[1.02] hover:border-[var(--border-tech-hover)] hover:bg-[var(--surface-panel-hover)]"
          >
            hello@telcore.example
          </a> */}
          <a
            href="#home"
            className="inline-flex rounded-full border border-[var(--border-tech)] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--text-nav-muted)] transition motion-safe:hover:scale-[1.02] hover:border-[var(--border-tech-hover)] hover:text-[var(--accent-hover)]"
          >
            Contact Us
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
