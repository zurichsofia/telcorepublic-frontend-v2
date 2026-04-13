import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative isolate w-full overflow-hidden bg-[#ffffff] py-24 sm:py-32"
    >
      {/* <ServicesAuroraBackground /> */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <ScrollReveal from="up" className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 lg:max-w-md">
              <div
                className="mb-5 h-px w-12 bg-gradient-to-r from-[var(--color-telco-red)]/55 to-transparent sm:w-16"
                aria-hidden
              />
              <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-[var(--color-black)]/75">
                What we offer
              </p>
              <h2 className="font-display mt-3 bg-gradient-to-br text-[var(--color-telco-red)] text-4xl font-normal tracking-[-0.02em] sm:text-[2.65rem] sm:leading-[1.12]">
                Our Services
              </h2>
              <p className="mt-6 text-[15px] font-light leading-[1.75] text-[var(--color-black)]/78">
                Research-led advisory across positioning, go-to-market, and
                long-term intelligence - structured for clarity at every step.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal from="left" delayMs={80} className="lg:col-span-7">
            <div className="border-t border-b border-[var(--border-tech)]/45">
              <ul className="divide-y divide-[var(--border-tech)]/40">
                {services.map((s, i) => {
                  const n = String(i + 1).padStart(2, "0");
                  return (
                    <li key={s.title}>
                      <article className="group py-9 sm:py-10">
                        <div className="flex gap-5 sm:gap-8">
                          <span
                            className="font-display w-9 shrink-0 pt-0.5 tabular-nums text-[13px] font-medium tracking-wide text-[var(--color-telco-red)] sm:w-10"
                            aria-hidden
                          >
                            {n}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-display text-[1.05rem] font-normal leading-snug tracking-[-0.02em] text-[var(--color-heading)] sm:text-[1.125rem]">
                                {s.title}
                              </h3>
                              <Link
                                href="#contact"
                                className="mt-0.5 shrink-0 text-[var(--color-heading)] opacity-55 transition duration-300 group-hover:opacity-100 group-hover:text-[var(--accent-hover)]"
                                aria-label={`Contact - ${s.title}`}
                              >
                                <ArrowUpRight className="h-[1.1rem] w-[1.1rem] stroke-[1.75] transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
                              </Link>
                            </div>
                            <p className="mt-4 max-w-xl text-[13.5px] font-light leading-[1.72] text-[var(--color-black)]/76">
                              {s.desc}
                            </p>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[var(--border-subtle)] bg-[#ffffff] px-5 py-24 sm:px-8 sm:py-32"
    >
      <ScrollReveal
        from="up"
        blur
        className="relative mx-auto max-w-2xl text-center"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-telco-red)]">
          Telcorepublic
        </p>
        <h2 className="font-display mt-4 text-4xl font-normal tracking-tight text-[var(--color-heading)] sm:text-5xl">
          Build on{" "}
          <em className="text-[var(--color-accent)] [text-shadow:0_0_30px_var(--glow-accent)]">
            evidence
          </em>
        </h2>
        <p className="mt-5 text-base font-light text-[var(--color-body)]">
          Share your timeline and constraints - we will respond with a clear view of
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
            Get in touch
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
