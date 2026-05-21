"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export const INSIGHTS_QUOTES_VIDEO_SRC =
  "/videos/TelcoRepublic_Ocean_1280x720.mp4";

const CYCLE_INTERVAL_MS = 4500;

const QUOTES = [
  {
    date: "MAY 15, 2026",
    text: "AI-native BSS platforms are becoming the new operating layer of telecom transformation. Legacy stacks can no longer support the speed of modern service ecosystems.",
  },
  {
    date: "JUN 05, 2025",
    text: "Modular OSS architectures are enabling operators to decouple network functions and accelerate innovation without wholesale infrastructure replacement.",
  },
  {
    date: "JUL 18, 2024",
    text: "The shift from infrastructure ownership to platform orchestration is redefining how telecom operators compete in cloud-native ecosystems.",
  },
  {
    date: "APR 28, 2026",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    date: "MAR 10, 2026",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    date: "FEB 02, 2026",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
] as const;

type Quote = (typeof QUOTES)[number];

const SLOTS = [
  {
    size: "large" as const,
    position:
      "relative z-20 lg:absolute lg:left-[26%] lg:top-0 lg:max-w-[min(52vw,560px)] xl:left-[28%]",
  },
  {
    size: "medium" as const,
    position:
      "relative z-10 lg:absolute lg:right-[2%] lg:top-[38%] lg:max-w-[min(38vw,420px)] xl:right-[4%]",
  },
  {
    size: "small" as const,
    position:
      "relative z-0 lg:absolute lg:bottom-6 lg:left-[1%] lg:max-w-[min(30vw,340px)] xl:bottom-10 xl:left-[3%]",
  },
] as const;

function quoteAt(activeIndex: number, slotOffset: number): Quote {
  const n = QUOTES.length;
  return QUOTES[(activeIndex + slotOffset) % n]!;
}

function OceanStrip({
  videoSrc,
  reduceMotion,
}: {
  videoSrc: string;
  reduceMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduceMotion) {
      v.pause();
      return;
    }
    void v.play().catch(() => {});
  }, [reduceMotion, videoSrc]);

  return (
    <div
      className="relative h-[min(50vw,480px)] min-h-[240px] w-full overflow-hidden bg-black sm:min-h-[280px] lg:min-h-[320px]"
      aria-hidden
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center grayscale"
        src={videoSrc}
        muted
        playsInline
        loop={!reduceMotion}
        preload="metadata"
        autoPlay={!reduceMotion}
      />
    </div>
  );
}

function BubbleContent({
  quote,
  size,
}: {
  quote: Quote;
  size: "large" | "medium" | "small";
}) {
  return (
    <>
      <p className="font-sans text-[0.68rem] font-normal tracking-[0.18em] text-white/55 uppercase">
        {quote.date}
      </p>
      <p
        className={cn(
          "mt-3 text-pretty font-sans leading-[1.35] text-white",
          size === "large" &&
            "mt-4 text-[1.05rem] font-semibold sm:text-[1.15rem] lg:text-xl",
          size === "medium" && "text-sm font-medium sm:text-[0.95rem]",
          size === "small" && "text-[0.82rem] font-medium leading-snug sm:text-sm",
        )}
      >
        <span className="text-white/90">&ldquo;</span>
        {quote.text}
        <span className="text-white/90">&rdquo;</span>
      </p>
    </>
  );
}

function CyclingMessageBubble({
  quote,
  size,
  className,
  reduceMotion,
}: {
  quote: Quote;
  size: "large" | "medium" | "small";
  className?: string;
  reduceMotion: boolean;
}) {
  return (
    <article className={cn("w-full", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[18px] bg-[#1c1c1c] shadow-[0_20px_50px_rgba(0,0,0,0.55)]",
          size === "large" && "px-7 py-6 sm:px-8 sm:py-7",
          size === "medium" && "px-6 py-5 sm:px-7 sm:py-6",
          size === "small" && "px-5 py-4 sm:px-6 sm:py-5",
        )}
      >
        {reduceMotion ? (
          <BubbleContent quote={quote} size={size} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${quote.date}-${quote.text}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <BubbleContent quote={quote} size={size} />
            </motion.div>
          </AnimatePresence>
        )}
        <span
          className="absolute -bottom-[7px] left-1/2 size-4 -translate-x-1/2 rotate-45 bg-[#1c1c1c]"
          aria-hidden
        />
      </div>
    </article>
  );
}

export function InsightsQuotesSection({
  videoSrc = INSIGHTS_QUOTES_VIDEO_SRC,
}: {
  videoSrc?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % QUOTES.length);
    }, CYCLE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section
      id="insights-quotes"
      className="relative isolate w-full"
      aria-label="Insights and perspectives"
    >
      <OceanStrip videoSrc={videoSrc} reduceMotion={reduceMotion} />

      <div className="relative bg-black px-4 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20 xl:px-12">
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mb-10 flex justify-center lg:absolute lg:left-0 lg:top-1/2 lg:mb-0 lg:-translate-y-1/2 lg:justify-start">
            <Image
              src="/images/TR_Bird_Icon.svg"
              alt=""
              width={200}
              height={200}
              className="h-24 w-auto sm:h-28 lg:h-36 xl:h-44"
              priority={false}
            />
          </div>

          <div
            className="relative flex flex-col gap-8 lg:min-h-[560px] lg:pl-[14%] xl:min-h-[600px] xl:pl-[12%]"
            role="region"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Industry insights"
          >
            {SLOTS.map((slot, slotIndex) => {
              const quote = quoteAt(activeIndex, slotIndex);
              return (
                <CyclingMessageBubble
                  key={slot.size}
                  quote={quote}
                  size={slot.size}
                  className={slot.position}
                  reduceMotion={reduceMotion}
                />
              );
            })}
            <p className="sr-only">
              {SLOTS.map((_, slotIndex) => {
                const q = quoteAt(activeIndex, slotIndex);
                return `${q.date}: ${q.text}`;
              }).join(". ")}
            </p>
          </div>
        </div>
      </div>

      <OceanStrip videoSrc={videoSrc} reduceMotion={reduceMotion} />
    </section>
  );
}
