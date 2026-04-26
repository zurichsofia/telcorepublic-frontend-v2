import Link from "next/link";

import { cn } from "@/lib/utils";

export type PageHeroLink = {
  label: string;
  href: string;
};

export type PageHeroProps = {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  id?: string;
  /** When set, shows a two-column list of links under the title (any labels / URLs you want). */
  links?: readonly PageHeroLink[];
};

export function PageHero({
  title,
  subtitle,
  description,
  className,
  id,
  links,
}: PageHeroProps) {
  const hasLinks = links != null;

  return (
    <section
      id={id}
      className={cn(
        "mx-auto px-5 sm:px-8 min-h-[calc(100dvh-6rem)] w-full mb-20",
        hasLinks
          ? "max-w-7xl py-14 text-center sm:py-20"
          : "flex max-w-4xl flex-col justify-center py-14 text-center sm:py-20",
        className,
      )}
    >
      <h1
        className={cn(
          "font-display text-5xl tracking-tight text-telco-red sm:text-7xl lg:text-8xl",
        )}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={cn(
            "mx-auto text-lg leading-snug mt-24 max-w-4xl font-normal text-telco-red sm:text-4xl",
          )}
        >
          {subtitle}
        </p>
      )}

      {links && (
        <div className="mt-16 flex w-full min-w-0 justify-center sm:mt-20">
          <div className="grid w-max min-w-0 max-w-full grid-cols-1 gap-x-30 gap-y-6 text-left sm:grid-cols-[max-content_max-content] sm:gap-y-8">
            <ul className="space-y-1" role="list">
              {links
                .slice(0, Math.ceil(links.length / 2))
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-display text-2xl font-medium tracking-tight text-telco-red transition sm:text-4xl"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
            <ul className="space-y-1" role="list">
              {links
                .slice(Math.ceil(links.length / 2))
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-display text-2xl font-medium tracking-tight text-telco-red sm:text-4xl"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {description && (
        <p
          className={cn(
            "mx-auto text-base font-light leading-relaxed sm:text-lg mt-8 max-w-3xl text-neutral-900",

          )}
        >
          {description}
        </p>
      )}
    </section>
  );
}
