"use client";

type HeroMidContentProps = {
  reduceMotion: boolean | null;
};

export function HeroMidContent({ reduceMotion }: HeroMidContentProps) {
  return (
    <div
      className="pointer-events-auto mx-auto flex min-h-dvh w-full max-w-[min(100%,1300px)] flex-col items-end justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-24"
      style={{
        opacity: "var(--sm-mid-opacity)",
        transform: "translateY(var(--sm-mid-block-y))",
      }}
      aria-hidden={reduceMotion === true ? true : undefined}
    >
      <div className="max-w-md text-right">
        <p
          className="font-display text-left text-xs font-medium uppercase tracking-widest text-[var(--color-telco-red)]"
          style={{ transform: "translateY(var(--sm-mid-label-y))" }}
        >
          Telcorepublic
        </p>
        <p
          className="mt-6 text-left font-display text-3xl font-normal tracking-tight text-white leading-tight sm:text-4xl lg:text-5xl"
          style={{ transform: "translateY(var(--sm-mid-title-y))" }}
        >
          Crossing the Telco Chasm
        </p>
        <p
          className="mt-6 ml-auto max-w-md text-left text-base font-light leading-relaxed text-white sm:text-lg"
          style={{ transform: "translateY(var(--sm-mid-body-y))" }}
        >
          We are the go-to, thought-provoking market research and advisory firm
          in the new telecommunications software market.
        </p>
      </div>
    </div>
  );
}
