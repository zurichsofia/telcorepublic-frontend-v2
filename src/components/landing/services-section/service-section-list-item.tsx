import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ServiceEntry } from "@/data/services";

import { ServiceLandingContentBlocks } from "./service-landing-content-blocks";

export type ServiceSectionListItemProps = {
  service: ServiceEntry;
  index: number;
};

export function ServiceSectionListItem({
  service: s,
  index,
}: ServiceSectionListItemProps) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <li>
      <article className="group py-16 sm:py-20 md:py-24">
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
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-black/76 sm:mt-7">
              {s.desc}
            </p>
            {s.intro ? (
              <div className="mt-10 max-w-2xl space-y-12 text-sm font-light text-black/62 md:mt-12 md:space-y-14">
                <p className="text-pretty">{s.intro}</p>
                <ServiceLandingContentBlocks blocks={s.content} withShell={false} />
              </div>
            ) : (
              <ServiceLandingContentBlocks blocks={s.content} />
            )}
          </div>
        </div>
      </article>
    </li>
  );
}
