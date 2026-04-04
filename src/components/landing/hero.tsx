import { HeroImageBackground } from "./hero-image-background";
import { HeroGlassNav } from "./hero-glass-nav";

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] mix-blend-overlay opacity-[0.35]"
      aria-hidden
    >
      <svg className="h-full w-full opacity-90">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" fill="white" filter="url(#grain)" />
      </svg>
    </div>
  );
}

function SocialProof() {
  const avatars = [
    "from-violet-400 to-fuchsia-500",
    "from-sky-400 to-indigo-500",
    "from-amber-300 to-orange-500",
    "from-emerald-400 to-teal-600",
  ];

  return (
    <div className="animate-fade-up delay-100">
      <p className="text-sm font-medium text-white/90">
        Trusted by teams across operators &amp; policy
      </p>
      <div className="mt-3 flex items-center pl-1">
        {avatars.map((gradient, i) => (
          <div
            key={gradient}
            className={`relative -ml-2 first:ml-0 h-9 w-9 rounded-full border-2 border-white/25 bg-gradient-to-br ${gradient} shadow-md first:z-0`}
            style={{ zIndex: avatars.length - i }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-[#0a0a0b] px-3 pb-10 pt-3 sm:px-5 sm:pb-14 sm:pt-5">
      <div className="relative mx-auto max-w-[min(100%,1400px)] overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_100px_-20px_rgba(0,0,0,0.85)] sm:rounded-[2.25rem]">
        <div className="relative min-h-[100svh] w-full sm:min-h-[min(92svh,880px)]">
          <div className="absolute inset-0">
            <HeroImageBackground />
            <div
              className="absolute inset-0 bg-linear-to-b from-black/50 via-black/35 to-black/75"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_40%,rgba(255,255,255,0.06),transparent_55%)]"
              aria-hidden
            />
            <GrainOverlay />
          </div>

          <HeroGlassNav />

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-12 pt-28 sm:min-h-[min(92svh,880px)] sm:justify-center sm:px-12 sm:pb-16 sm:pt-32 lg:px-16">
            <div className="max-w-xl">
              <h1 className="animate-fade-up text-[clamp(2rem,5.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                Research the networks that power what&apos;s next.
              </h1>

              {/* <div className="mt-8">
                <SocialProof />
              </div> */}

              <p className="animate-fade-up delay-200 mt-8 text-base leading-relaxed text-white/75 sm:text-lg">
                Independent spectrum, infrastructure, and traffic insight — so you
                can plan coverage, policy, and investment with evidence, not noise.
              </p>

              {/* <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                <PillCta href="#contact" variant="solid">
                  Sign up
                </PillCta>
                <PillCta href="#research" variant="glass">
                  Learn more
                </PillCta>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
