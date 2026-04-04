import { HeroGlassNav } from "./hero-glass-nav";

export function Hero() {
  return (
    <section className="bg-transparent px-3 pb-10 pt-3 sm:px-5 sm:pb-14 sm:pt-5">
      <div className="relative mx-auto max-w-[min(100%,1400px)] overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_100px_-20px_rgba(0,0,0,0.85)] sm:rounded-[2.25rem]">
        <div className="relative min-h-[100svh] w-full sm:min-h-[200svh]">
          <HeroGlassNav />

          <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:px-12 sm:pb-20 sm:pt-32 lg:px-16">
            <div className="max-w-xl">
              <h1 className="animate-fade-up text-[clamp(2rem,5.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                Research the networks that power what&apos;s next.
              </h1>

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

          <div className="hidden min-h-[100svh] sm:block" aria-hidden />
        </div>
      </div>
    </section>
  );
}
