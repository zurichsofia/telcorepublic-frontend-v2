"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { services, type ServiceContentBlock } from "@/data/services";

function ServiceContentBlocks({
  blocks,
}: {
  blocks: readonly ServiceContentBlock[];
}) {
  return (
    <div className="mt-6 max-w-2xl space-y-6 text-sm font-light leading-relaxed text-black/62">
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key} className="text-pretty">
                {block.text}
              </p>
            );
          case "subheading":
            return (
              <h4
                key={key}
                className="font-display text-base font-normal tracking-tight text-black/88"
              >
                {block.text}
              </h4>
            );
          case "roleCallouts":
            return (
              <ul
                key={key}
                className="grid gap-4 sm:grid-cols-2 sm:gap-5"
              >
                {block.items.map((item) => (
                  <li
                    key={item.role}
                    className="rounded-lg border border-[color-mix(in_srgb,var(--color-clouds)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-clouds)_12%,transparent)] px-4 py-3.5 sm:px-5 sm:py-4"
                  >
                    <p className="font-display text-xs font-medium uppercase tracking-widest text-(--color-telco-red)">
                      {item.role}
                    </p>
                    <p className="mt-2 text-pretty text-black/70">{item.text}</p>
                  </li>
                ))}
              </ul>
            );
          case "tagList":
            return (
              <div key={key} className="space-y-3">
                {block.heading ? (
                  <h4 className="font-display text-base font-normal tracking-tight text-black/88">
                    {block.heading}
                  </h4>
                ) : null}
                <ul className="flex flex-wrap gap-2">
                  {block.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[color-mix(in_srgb,var(--color-clouds)_50%,transparent)] bg-white px-3 py-1 text-xs tracking-wide text-black/75"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "offers":
            return (
              <div key={key} className="space-y-4">
                {block.heading ? (
                  <h4 className="font-display text-base font-normal tracking-tight text-black/88">
                    {block.heading}
                  </h4>
                ) : null}
                <ul className="space-y-4">
                  {block.items.map((item) => (
                    <li key={item.name}>
                      <p className="font-medium text-black/85">{item.name}</p>
                      <p className="mt-1 text-pretty">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "simpleList":
            return (
              <div key={key} className="space-y-3">
                {block.heading ? (
                  <h4 className="font-display text-base font-normal tracking-tight text-black/88">
                    {block.heading}
                  </h4>
                ) : null}
                <ul className="list-inside list-disc space-y-1.5 marker:text-(--color-telco-red)/70">
                  {block.items.map((item) => (
                    <li key={item} className="text-pretty pl-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          default: {
            const _exhaustive: never = block;
            return _exhaustive;
          }
        }
      })}
    </div>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative isolate w-full overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <ScrollReveal from="up" className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 lg:max-w-md">
              <div
                className="mb-5 h-px w-12 bg-linear-to-r from-(--color-telco-red)/55 to-transparent sm:w-16"
                aria-hidden
              />
              <p className="text-xs font-medium uppercase tracking-widest text-black/75">
                What we offer
              </p>
              <h2 className="font-display mt-3 bg-linear-to-br text-4xl font-normal tracking-tight text-(--color-telco-red) leading-tight sm:text-5xl">
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
                    <li key={s.slug}>
                      <article className="group py-9 sm:py-10">
                        <div className="flex gap-5 sm:gap-8">
                          <span
                            className="font-display w-9 shrink-0 pt-0.5 tabular-nums text-sm font-medium tracking-wide text-(--color-telco-red) sm:w-10"
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
                                className="mt-0.5 shrink-0 text-black opacity-55 transition duration-300 group-hover:opacity-100 group-hover:text-(--color-telco-red)"
                                aria-label={`Contact - ${s.title}`}
                              >
                                <ArrowUpRight className="h-[1.1rem] w-[1.1rem] stroke-[1.75] transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
                              </Link>
                            </div>
                            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-black/76">
                              {s.desc}
                            </p>
                            <ServiceContentBlocks blocks={s.content} />
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
