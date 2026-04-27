export function ServiceSectionIntro() {
  return (
    <div className="lg:col-span-5">
      <div className="lg:sticky lg:top-28 lg:max-w-md">
        <div
          className="mb-6 h-px w-12 bg-linear-to-r from-(--color-telco-red)/55 to-transparent sm:w-16"
          aria-hidden
        />
        <p className="text-xs font-medium uppercase tracking-widest text-black/75">
          What we offer
        </p>
        <h2 className="font-display mt-4 bg-linear-to-br text-4xl font-normal tracking-tight text-(--color-telco-red) leading-tight sm:text-5xl">
          Our Services
        </h2>
        <p className="mt-10 text-base font-light leading-relaxed text-black/78 md:mt-12">
          Research-led advisory across positioning, go-to-market, and
          long-term intelligence - structured for clarity at every step.
        </p>
      </div>
    </div>
  );
}
