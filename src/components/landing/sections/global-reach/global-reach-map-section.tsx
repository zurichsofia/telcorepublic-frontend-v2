import WorldMap from "./world-map";

const MISSION_BENEFITS = [
  "World-class insights",
  "Local market knowledge",
] as const;

export function GlobalReachMapSection() {
  return (
    <section
      id="global-reach"
      className="relative z-30 w-full overflow-hidden bg-white px-6 py-40 sm:px-10 sm:pb-36 lg:px-16 xl:px-20"
      aria-labelledby="global-reach-heading"
    >
      {/* <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
       
      <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-telco-dark md:text-xl">
        Leverage Telco Republic&apos;s network to connect with industry leaders and
        emerging technology solutions, fostering co-innovation and expanding your
        market reach.
      </p>
    </div> */}
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 text-center sm:px-8">
        {/* <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-telco-red">
          TR Mission
        </p> */}

        <h2
          id="global-reach-heading"
          className="mt-8 text-pretty font-display text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-[1.2] tracking-tight text-telco-dark"
        >
          We bring together
          <br />
          global industry experts and
          <br />
          <span className="text-telco-red">cutting-edge innovation at scale</span>
        </h2>

        <p className="mt-8 max-w-2xl text-pretty text-base font-light leading-relaxed text-telco-dark/90 sm:text-lg lg:text-xl">
          ensuring that every project benefits from:
        </p>

        <ul className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:gap-4" role="list">
          {MISSION_BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-3 text-base font-light text-telco-dark sm:text-lg"
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

      <div className="relative mx-auto mt-14 max-w-6xl sm:mt-20">
        <WorldMap />
      </div>
    </section >
  );
}
