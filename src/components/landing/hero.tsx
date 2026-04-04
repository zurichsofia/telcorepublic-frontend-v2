import { HeroGlassNav } from "./hero-glass-nav";

export function Hero() {
  return (
    <section className="bg-transparent px-3 pb-10 pt-3 sm:px-5 sm:pb-14 sm:pt-5">
      <div className="relative mx-auto w-full max-w-[min(100%,1400px)] border-0 bg-transparent shadow-none ring-0 outline-none">
        <div className="relative min-h-[90svh] w-full">
          <HeroGlassNav />

          <div className="relative z-10 flex min-h-[100vh] flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:px-12 sm:pb-20 sm:pt-32 lg:px-16">
            <div className="max-w-5xl">
              <h1 className="font-display animate-fade-up text-[clamp(2.75rem,8vw,4.875rem)] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--color-heading)] [text-shadow:0_2px_30px_rgba(0,0,0,0.6),0_0_80px_rgba(0,0,0,0.4)]">
                Navigating the Shift.
                Leading the Techco Revolution.
              </h1>

              <p className="animate-fade-up delay-200 mt-8 text-base font-light leading-[1.7] text-[var(--color-body)] sm:text-lg">
                Fact-Based Research.
                Actionable Disruption.
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
