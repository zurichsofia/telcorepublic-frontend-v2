import Link from "next/link";

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
    <section
      id="research"
      className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7cb8ff]">
        Your research partner
      </p>
      <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[#f4f2ed] sm:text-5xl">
        Networks that stay honest under load
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
        Telcorepublic is an independent research practice focused on telecommunications
        infrastructure, radio systems, and the economics of connectivity. We help
        you see trade-offs before they become outages or stranded assets.
      </p>
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {pillars.map((p) => (
          <article
            key={p.title}
            className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition hover:border-white/[0.14] hover:bg-white/[0.04]"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7cb8ff]/90">
              {p.tag}
            </p>
            <h3 className="mt-4 font-bold tracking-tight text-2xl text-[#f4f2ed]">
              {p.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MethodologySection() {
  return (
    <section
      id="methodology"
      className="border-t border-white/[0.06] bg-[#07090c]"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7cb8ff]">
              How we work
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#f4f2ed] sm:text-[2.75rem]">
              Methodology you can audit
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
              From lab benchmarks to national models, every engagement is documented
              so your technical and executive stakeholders share one picture of risk
              and opportunity.
            </p>
            <Link
              href="#contact"
              className="mt-8 inline-flex rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/25"
            >
              Request a scope
            </Link>
          </div>
          <ul className="space-y-6">
            {methodology.map((m) => (
              <li
                key={m.title}
                className="rounded-2xl border border-white/[0.06] bg-[#050608]/80 p-7"
              >
                <h3 className="font-bold tracking-tight text-xl text-[#f4f2ed]">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{m.body}</p>
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
    <section className="relative overflow-hidden border-y border-white/[0.06] py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(124,184,255,0.08),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.15] tracking-tight text-[#f4f2ed]">
          From spectrum maps to subscriber experience — we connect the physics to
          the business case.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-white/55">
          Long-horizon research, short feedback loops. Tell us where your network is
          headed; we will help you stress-test the path.
        </p>
      </div>
    </section>
  );
}

export function InsightsSection() {
  return (
    <section id="insights" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7cb8ff]">
            Outputs
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#f4f2ed] sm:text-5xl">
            Insights &amp; collaboration
          </h2>
        </div>
        <Link
          href="#contact"
          className="shrink-0 rounded-full bg-[#f4f2ed] px-6 py-3 text-sm font-semibold text-[#050608] transition hover:bg-white"
        >
          Start a conversation
        </Link>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {insights.map((i) => (
          <article
            key={i.title}
            className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8"
          >
            <h3 className="font-bold tracking-tight text-2xl text-[#f4f2ed]">
              {i.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
              {i.desc}
            </p>
            <span className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/35">
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
      className="border-t border-white/[0.06] bg-gradient-to-b from-[#07090c] to-[#050608] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7cb8ff]">
          Telcore Research
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#f4f2ed] sm:text-5xl">
          Build on evidence
        </h2>
        <p className="mt-5 text-base text-white/55">
          Share your timeline and constraints — we will respond with a clear view of
          what we can prove, model, or measure together.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:hello@telcore.example"
            className="inline-flex rounded-full bg-[#f4f2ed] px-8 py-3.5 text-sm font-semibold text-[#050608] transition hover:bg-white"
          >
            hello@telcore.example
          </a>
          <a
            href="#research"
            className="inline-flex rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30"
          >
            Back to top
          </a>
        </div>
      </div>
    </section>
  );
}
