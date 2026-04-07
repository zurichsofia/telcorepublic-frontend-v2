"use client";

export function HeroScrollHint() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[24] flex justify-center">
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-end pb-10 sm:pb-14">
        <div className="flex flex-col items-center">
          <a
            href="#signal"
            className="pointer-events-auto flex items-center gap-3 rounded-full text-[10px] font-medium uppercase tracking-[0.28em] text-[#001538] animate-pulse duration-900"
            aria-label="Scroll to Signal intelligence"
          >
            <span
              className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(200,210,224,0.45)]"
              aria-hidden
            />
            <span>Scroll</span>
          </a>
        </div>
      </div>
    </div>
  );
}
