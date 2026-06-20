"use client";

import WorldMap from "./world-map";

const MISSION_BENEFITS = [
  "World-class insights",
  "Local market knowledge",
] as const;

export function GlobalReachMapSection() {
  return (
    <section
      id="global-reach"
      className="relative z-30 w-full overflow-hidden bg-white px-6 pt-40 pb-20 sm:px-10 sm:pt-20 sm:pb-36 lg:px-16 lg:py-40 xl:px-20"
      aria-labelledby="global-reach-heading"
    >

      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 text-center sm:px-8">

        <h2
          id="global-reach-heading"
          className="text-pretty font-display text-3xl font-normal leading-[1.2] tracking-tight text-telco-dark sm:mt-8 md:text-5xl"
        >
          We bring together
          <br />
          global industry experts and
          <br />
          <span className="text-telco-red">cutting-edge innovation at scale</span>
        </h2>

        <p className="mt-8 max-w-2xl text-pretty font-light leading-relaxed text-telco-dark/90 text-lg">
          ensuring that every project benefits from:
        </p>

        <ul className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:gap-4" role="list">
          {MISSION_BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-3 text-xl font-light text-telco-dark sm:text-2xl"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-telco-red/10 text-telco-red"
                aria-hidden
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto mt-24 max-w-6xl sm:mt-20 scale-140 -translate-x-5 sm:scale-100 sm:translate-y-0">
        <WorldMap />
      </div>
    </section >
  );
}
