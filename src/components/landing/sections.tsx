import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative isolate w-full overflow-hidden bg-white py-24 sm:py-32"
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
              <p className="text-xs font-medium uppercase tracking-widest text-black/75">
                What we offer
              </p>
              <h2 className="font-display mt-3 bg-gradient-to-br text-4xl font-normal tracking-tight text-[var(--color-telco-red)] leading-tight sm:text-5xl">
                Our Services
              </h2>
              <p className="mt-6 text-base font-light leading-relaxed text-black/78">
                Research-led advisory across positioning, go-to-market, and
                long-term intelligence - structured for clarity at every step.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal from="left" delayMs={80} className="lg:col-span-7">
            <div className="border-t border-b border-[color-mix(in_srgb,var(--color-clouds)_45%,transparent)]">
              <ul className="divide-y divide-[color-mix(in_srgb,var(--color-clouds)_40%,transparent)]">
                {services.map((s, i) => {
                  const n = String(i + 1).padStart(2, "0");
                  return (
                    <li key={s.title}>
                      <article className="group py-9 sm:py-10">
                        <div className="flex gap-5 sm:gap-8">
                          <span
                            className="font-display w-9 shrink-0 pt-0.5 tabular-nums text-sm font-medium tracking-wide text-[var(--color-telco-red)] sm:w-10"
                            aria-hidden
                          >
                            {n}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-display text-lg font-normal leading-snug tracking-tight text-black sm:text-xl">
                                {s.title}
                              </h3>
                              <Link
                                href="#contact"
                                className="mt-0.5 shrink-0 text-black opacity-55 transition duration-300 group-hover:opacity-100 group-hover:text-[var(--color-telco-red)]"
                                aria-label={`Contact - ${s.title}`}
                              >
                                <ArrowUpRight className="h-[1.1rem] w-[1.1rem] stroke-[1.75] transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
                              </Link>
                            </div>
                            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-black/76">
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
      className="relative overflow-hidden border-t border-[color-mix(in_srgb,var(--color-clouds)_28%,transparent)] bg-white px-5 py-24 sm:px-8 sm:py-32"
    >
      <ScrollReveal
        from="up"
        blur
        className="relative mx-auto max-w-2xl text-center"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-telco-red)]">
          Telcorepublic
        </p>
        <h2 className="font-display mt-4 text-4xl font-normal tracking-tight text-black sm:text-5xl">
          Build on{" "}
          <em className="text-[var(--color-telco-red)] [text-shadow:0_0_30px_rgba(235,30,37,0.22)]">
            evidence
          </em>
        </h2>
        <p className="mt-5 text-base font-light leading-relaxed text-black">
          Share your timeline and constraints - we will respond with a clear view of
          what we can prove, model, or measure together.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {/* <a
            href="mailto:hello@telcore.example"
            className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-clouds)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-white)_90%,transparent)] px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-[var(--color-telco-red)] transition motion-safe:hover:scale-[1.02] hover:border-[color-mix(in_srgb,var(--color-telco-red)_55%,transparent)] hover:bg-[var(--color-white)]"
          >
            hello@telcore.example
          </a> */}
          <a
            href="#home"
            className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--color-clouds)_50%,transparent)] px-8 py-3.5 text-sm font-medium uppercase tracking-wide text-black transition motion-safe:hover:scale-[1.02] hover:border-[color-mix(in_srgb,var(--color-telco-red)_55%,transparent)] hover:text-[var(--color-telco-red)]"
          >
            Get in touch
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
