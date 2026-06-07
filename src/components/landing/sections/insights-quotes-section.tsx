"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { InsightQuote } from "@/data/news";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export const INSIGHTS_QUOTES_VIDEO_SRC =
  "/videos/TelcoRepublic_Ocean_1280x720.mp4";

/** Pause between stack updates */
const SWAP_INTERVAL_MS = 4000;

type Quote = InsightQuote;
type BubbleSize = "large" | "medium" | "small";

type StackCard = {
  id: number;
  quoteIndex: number;
};

/** Slot 0 = top (exits), slot 2 = bottom (new entries) */
const STACK_GAP_CLASS = "gap-10 sm:gap-12 lg:gap-14";
/** Room for the bottom bubble tail (absolute, does not affect flex height) */
const STACK_TAIL_PADDING = "pb-5 sm:pb-6";

const STACK_SLOTS: {
  size: BubbleSize;
  className: string;
}[] = [
    {
      size: "large",
      className: "w-full lg:w-[90%] lg:self-end",
    },
    {
      size: "medium",
      className:
        "w-full lg:w-1/2 lg:translate-x-6 lg:self-center xl:translate-x-10",
    },
    {
      size: "small",
      className:
        "w-full min-w-0 lg:w-[35%] lg:-translate-x-4 lg:self-start xl:-translate-x-6",
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

/** Fixed bubble heights sized to fit the tallest quote at each slot (with lg variants). */
const BUBBLE_HEIGHT_CLASS: Record<BubbleSize, string> = {
  large: "h-[11rem] lg:h-[12rem]",
  medium: "h-[9.25rem] lg:h-[10rem]",
  small: "h-[7rem] lg:h-[9.5rem]",
};

function createInitialCards(quotes: readonly Quote[]): StackCard[] {
  return Array.from({ length: Math.min(3, quotes.length) }, (_, i) => ({
    id: i,
    quoteIndex: i % quotes.length,
  }));
}

function OceanStrip({
  videoSrc,
  reduceMotion,
  preload = "metadata",
}: {
  videoSrc: string;
  reduceMotion: boolean;
  preload?: "metadata" | "none";
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    const v = videoRef.current;
    if (!strip || !v) return;

    if (reduceMotion) {
      v.pause();
      return;
    }

    const syncPlayback = (inView: boolean) => {
      if (inView) {
        void v.play().catch(() => { });
      } else {
        v.pause();
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      syncPlayback(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) syncPlayback(entry.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 0.05 },
    );
    io.observe(strip);
    return () => io.disconnect();
  }, [reduceMotion, videoSrc]);

  return (
    <div
      ref={stripRef}
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
        preload={preload}
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
    <Link
      href={quote.href}
      aria-label={`Read article: ${quote.title}`}
      className={cn(
        "relative flex w-full flex-col justify-center rounded-[18px] bg-[#1c1c1c] shadow-[0_20px_50px_rgba(0,0,0,0.55)]",
        "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
        BUBBLE_HEIGHT_CLASS[size],
        size === "large" && "px-7 py-6 sm:px-8 sm:py-7",
        size === "medium" && "px-6 py-5 sm:px-7 sm:py-6",
        size === "small" && "px-5 py-4 sm:px-6 sm:py-5",
      )}
    >
      <p
        className={cn(
          "font-sans font-normal tracking-[0.18em] text-white/55 uppercase",
          size === "large" && "text-xs sm:text-[0.8rem]",
          size === "medium" && "text-[0.62rem] sm:text-[0.65rem]",
          size === "small" && "text-[0.6rem] sm:text-[0.65rem]",
        )}
      >
        {quote.date}
      </p>
      <p
        className={cn(
          "text-pretty font-sans text-white",
          size === "large" &&
          "mt-4 text-lg font-semibold leading-[1.35] sm:text-xl lg:text-2xl",
          size === "medium" &&
          "mt-3 text-sm font-medium leading-[1.35] sm:text-base lg:text-lg",
          size === "small" &&
          "mt-2.5 text-sm font-medium leading-snug sm:text-base lg:text-[0.9rem]",
        )}
      >
        <span className="text-white/90">&ldquo;</span>
        {quote.text}
        <span className="text-white/90">&rdquo;</span>
      </p>
      <span
        className={cn(
          "absolute rotate-45 bg-[#1c1c1c]",
          size === "large" && "-bottom-[10px] left-8 size-6",
          size === "medium" && "-bottom-[9px] left-6 size-5",
          size === "small" && "-bottom-[7px] left-5 size-4",
        )}
        aria-hidden
      />
    </Link>
  );
}

function NotificationStack({
  quotes,
  reduceMotion,
}: {
  quotes: readonly Quote[];
  reduceMotion: boolean;
}) {
  const initialCards = createInitialCards(quotes);
  const [cards, setCards] = useState<StackCard[]>(initialCards);
  const [enteringId, setEnteringId] = useState<number | null>(null);
  const nextId = useRef(initialCards.length);
  const quoteCursor = useRef(initialCards.length);

  useEffect(() => {
    if (reduceMotion || quotes.length === 0) return;

    const id = window.setInterval(() => {
      const newId = nextId.current++;
      const newCard: StackCard = {
        id: newId,
        quoteIndex: quoteCursor.current++ % quotes.length,
      };

      setEnteringId(newId);
      setCards((prev) => {
        if (prev.length < 3) return [...prev, newCard];
        return [prev[1]!, prev[2]!, newCard];
      });

      window.setTimeout(() => setEnteringId(null), 550);
    }, SWAP_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion, quotes.length]);

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "relative flex flex-col",
          STACK_GAP_CLASS,
          STACK_TAIL_PADDING,
        )}
      >
        {initialCards.map((card, slotIndex) => (
          <div key={card.id} className={STACK_SLOTS[slotIndex]!.className}>
            <MessageBubble
              quote={quotes[card.quoteIndex]!}
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
        <div
          className={cn(
            "relative flex flex-col overflow-visible",
            STACK_GAP_CLASS,
            STACK_TAIL_PADDING,
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {cards.map((card, slotIndex) => {
              const slot = STACK_SLOTS[slotIndex]!;
              const isEntering = card.id === enteringId;

              return (
                <motion.div
                  key={card.id}
                  layout
                  className={cn(slot.className, "overflow-visible")}
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
                    quote={quotes[card.quoteIndex]!}
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
            const q = quotes[card.quoteIndex]!;
            return `${q.date}: ${q.text}`;
          })
          .join(". ")}
      </p>
    </>
  );
}

export function InsightsQuotesSection({
  quotes,
  videoSrc = INSIGHTS_QUOTES_VIDEO_SRC,
  showOceanStrip = true,
}: {
  quotes: readonly InsightQuote[];
  videoSrc?: string;
  showOceanStrip?: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();

  if (quotes.length === 0) return null;

  return (
    <section
      id="insights-quotes"
      className="relative isolate w-full"
      aria-label="Insights and perspectives"
    >
      {showOceanStrip ? (
        <OceanStrip videoSrc={videoSrc} reduceMotion={reduceMotion} />
      ) : null}

      <div className="relative bg-black px-4 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20 xl:px-12">
        <div className="relative mx-auto w-full max-w-6xl overflow-visible">
          <div className="mb-10 flex justify-center lg:absolute lg:-left-6 lg:top-1/2 lg:mb-0 lg:-translate-y-1/2 lg:justify-start xl:-left-10">
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
            className="relative overflow-visible lg:pl-[4%] xl:pl-[2%]"
            role="region"
            aria-live="polite"
            aria-label="Industry insights"
          >
            <NotificationStack quotes={quotes} reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>

      {showOceanStrip ? (
        <OceanStrip
          videoSrc={videoSrc}
          reduceMotion={reduceMotion}
          preload="none"
        />
      ) : null}
    </section>
  );
}