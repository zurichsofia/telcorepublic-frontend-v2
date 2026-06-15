import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PageHeroLink = {
  label: string;
  href: string;
};

export type PageHeroProps = {
  title: string;
  subtitle?: ReactNode;
  description?: string;
  className?: string;
  id?: string;
  /** When set, shows a two-column list of links under the title (any labels / URLs you want). */
  links?: readonly PageHeroLink[];
};

const linkClassName =
  "font-display text-2xl font-medium tracking-tight text-telco-red transition sm:text-[2.5rem] leading-tight";

export function PageHero({
  title,
  subtitle,
  description,
  className,
  id,
  links,
}: PageHeroProps) {
  const hasLinks = links != null;
  const linkRows = links ? Math.ceil(links.length / 2) : 0;

  return (
    <section
      id={id}
      className={cn(
        "mx-auto mb-20 w-full px-5 pb-14 pt-32 text-center sm:px-8 sm:pb-20 sm:pt-44",
        hasLinks ? "max-w-7xl" : "flex max-w-4xl flex-col justify-center",
        className,
      )}
    >
      <h1 className="font-display text-5xl text-telco-red sm:text-7xl lg:text-8xl">
        {title}
      </h1>

      {subtitle && (
        <p className="mx-auto mt-24 max-w-4xl text-lg font-normal leading-snug text-telco-red sm:text-4xl">
          {subtitle}
        </p>
      )}

      {links && (
        <ul
          role="list"
          className="mx-auto w-max max-w-full space-y-1 text-left sm:mt-28 sm:grid sm:auto-cols-max sm:grid-flow-col sm:gap-x-48 sm:space-y-0"
          style={{ gridTemplateRows: `repeat(${linkRows}, auto)` }}
        >
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClassName}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {description && (
        <p className="mx-auto mt-8 max-w-3xl text-base font-light leading-relaxed text-telco-dark sm:text-lg">
          {description}
        </p>
      )}
    </section>
  );
}
