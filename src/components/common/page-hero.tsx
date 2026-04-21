import { cn } from "@/lib/utils";

export type PageHeroProps = {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  id?: string;
  /**
   * `editorial` — left-aligned neutral hero.
   * `centered` — centered hero with red title/subtitle and black body (e.g. about pages).
   */
  variant?: "editorial" | "centered";
};

/**
 * Page hero with title, optional subtitle, optional description.
 * Uses standard Tailwind scale utilities only (no arbitrary sizing).
 */
export function PageHero({
  title,
  subtitle,
  description,
  className,
  id,
  variant = "editorial",
}: PageHeroProps) {
  if (variant === "centered") {
    return (
      <section
        id={id}
        className={cn(
          "mx-auto flex min-h-[calc(100vh-60rem)] w-full max-w-4xl flex-col justify-center px-5 text-center sm:px-8 sm:min-h-[calc(100vh-240px)]",
          className,
        )}
      >
        <h1 className="font-display text-5xl tracking-tight text-red-600 sm:text-8xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-24 max-w-4xl text-lg font-normal leading-snug text-red-600 sm:text-4xl">
            {subtitle}
          </p>
        ) : null}
        {description ? (
          <p className="mx-auto mt-8 max-w-3xl text-base font-light leading-relaxed text-neutral-900 sm:text-lg">
            {description}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20", className)}
    >
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-lg font-normal leading-snug text-neutral-700 sm:text-xl">
            {subtitle}
          </p>
        ) : null}
        {description ? (
          <p className="mt-6 text-base font-light leading-relaxed text-neutral-600 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
