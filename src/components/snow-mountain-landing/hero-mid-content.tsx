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
          className="font-display text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--color-telco-red)] text-left"
          style={{ transform: "translateY(var(--sm-mid-label-y))" }}
        >
          Telcorepublic
        </p>
        <p
          className="mt-6 font-display text-[clamp(1.75rem,4.5vw,2.35rem)] font-normal leading-[1.12] tracking-[-0.02em] text-white text-left"
          style={{ transform: "translateY(var(--sm-mid-title-y))" }}
        >
          Crossing the Telco Chasm
        </p>
        <p
          className="mt-6 ml-auto max-w-md text-base font-light leading-[1.75] text-white sm:text-[1.05rem] text-left"
          style={{ transform: "translateY(var(--sm-mid-body-y))" }}
        >
          We are the go-to, thought-provoking market research and advisory firm
          in the new telecommunications software market.
        </p>
      </div>
    </div>
  );
}
