"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export const INSIGHTS_QUOTES_VIDEO_SRC =
  "/videos/TelcoRepublic_Ocean_1280x720.mp4";

/** Pause between stack updates */
const SWAP_INTERVAL_MS = 4000;

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
type BubbleSize = "large" | "medium" | "small";

type StackCard = {
  id: number;
  quoteIndex: number;
};

/** Slot 0 = top (exits), slot 2 = bottom (new entries) */
const STACK_SLOTS: {
  size: BubbleSize;
  className: string;
}[] = [
  {
    size: "large",
    className:
      "w-full lg:absolute lg:left-[10%] lg:top-0 lg:w-[min(52vw,560px)] xl:left-[12%]",
  },
  {
    size: "medium",
    className:
      "w-full lg:absolute lg:right-[2%] lg:top-[36%] lg:w-[min(38vw,420px)] xl:right-[4%]",
  },
  {
    size: "small",
    className:
      "w-full lg:absolute lg:bottom-8 lg:left-[2%] lg:w-[min(30vw,340px)] xl:bottom-10 xl:left-[4%]",
  },
];

const layoutSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};

const enterSpring = {
  type: "spring" as const,
  stiffness: 480,
  damping: 36,
  mass: 0.8,
};

const exitTransition = {
  type: "spring" as const,
  stiffness: 520,
  damping: 38,
  mass: 0.75,
};

const INITIAL_CARDS: StackCard[] = [
  { id: 0, quoteIndex: 0 },
  { id: 1, quoteIndex: 1 },
  { id: 2, quoteIndex: 2 },
];

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

function MessageBubble({
  quote,
  size,
}: {
  quote: Quote;
  size: BubbleSize;
}) {
  return (
    <div
      className={cn(
        "relative w-full rounded-[18px] bg-[#1c1c1c] shadow-[0_20px_50px_rgba(0,0,0,0.55)]",
        size === "large" && "px-7 py-6 sm:px-8 sm:py-7",
        size === "medium" && "px-6 py-5 sm:px-7 sm:py-6",
        size === "small" && "px-5 py-4 sm:px-6 sm:py-5",
      )}
    >
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
      <span
        className="absolute -bottom-[7px] left-1/2 size-4 -translate-x-1/2 rotate-45 bg-[#1c1c1c]"
        aria-hidden
      />
    </div>
  );
}

function NotificationStack({ reduceMotion }: { reduceMotion: boolean }) {
  const [cards, setCards] = useState<StackCard[]>(INITIAL_CARDS);
  const [enteringId, setEnteringId] = useState<number | null>(null);
  const nextId = useRef(INITIAL_CARDS.length);
  const quoteCursor = useRef(INITIAL_CARDS.length);

  useEffect(() => {
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      const newId = nextId.current++;
      const newCard: StackCard = {
        id: newId,
        quoteIndex: quoteCursor.current++ % QUOTES.length,
      };

      setEnteringId(newId);
      setCards((prev) => [prev[1]!, prev[2]!, newCard]);

      window.setTimeout(() => setEnteringId(null), 550);
    }, SWAP_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="relative flex flex-col gap-8 lg:h-[580px] lg:gap-0">
        {INITIAL_CARDS.map((card, slotIndex) => (
          <div key={card.id} className={STACK_SLOTS[slotIndex]!.className}>
            <MessageBubble
              quote={QUOTES[card.quoteIndex]!}
              size={STACK_SLOTS[slotIndex]!.size}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <LayoutGroup id="insights-notification-stack">
        <div className="relative flex flex-col gap-8 overflow-hidden lg:h-[580px] lg:gap-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {cards.map((card, slotIndex) => {
              const slot = STACK_SLOTS[slotIndex]!;
              const isEntering = card.id === enteringId;

              return (
                <motion.div
                  key={card.id}
                  layout
                  className={slot.className}
                  initial={
                    isEntering
                      ? { y: 56, opacity: 0, scale: 0.96 }
                      : false
                  }
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{
                    y: -48,
                    opacity: 0,
                    scale: 0.96,
                    transition: exitTransition,
                  }}
                  transition={{
                    layout: layoutSpring,
                    ...(isEntering
                      ? {
                          y: enterSpring,
                          opacity: enterSpring,
                          scale: enterSpring,
                        }
                      : {
                          y: layoutSpring,
                          opacity: { duration: 0.35 },
                          scale: layoutSpring,
                        }),
                  }}
                >
                  <MessageBubble
                    quote={QUOTES[card.quoteIndex]!}
                    size={slot.size}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </LayoutGroup>
      <p className="sr-only">
        {cards
          .map((card) => {
            const q = QUOTES[card.quoteIndex]!;
            return `${q.date}: ${q.text}`;
          })
          .join(". ")}
      </p>
    </>
  );
}

export function InsightsQuotesSection({
  videoSrc = INSIGHTS_QUOTES_VIDEO_SRC,
}: {
  videoSrc?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();

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
            className="relative lg:min-h-[580px] lg:pl-[14%] xl:pl-[12%]"
            role="region"
            aria-live="polite"
            aria-label="Industry insights"
          >
            <NotificationStack reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>

      <OceanStrip videoSrc={videoSrc} reduceMotion={reduceMotion} />
    </section>
  );
}