"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { InsightQuote } from "@/data/news";
import { isLenisActive, subscribeLenisScroll } from "@/lib/lenis-scroll";
import { cn } from "@/lib/utils";

type Quote = InsightQuote;
type BubbleSize = "large" | "medium" | "small";

type StackCard = {
  id: number;
  quoteIndex: number;
};

/** Pause between stack updates */
const SWAP_INTERVAL_MS = 4000;

/** Slot 0 = top (exits), slot 2 = bottom (new entries) */
const STACK_GAP_CLASS = "gap-12 lg:gap-20";
/** Room for the bottom bubble tail (absolute, does not affect flex height) */
const STACK_TAIL_PADDING = "pb-5 sm:pb-6";

const STACK_SLOTS: {
  size: BubbleSize;
  className: string;
}[] = [
  {
    size: "large",
    className: "w-full self-end lg:w-[90%]",
  },
  {
    size: "medium",
    className:
      "w-[72%] self-end lg:w-1/2 lg:translate-x-6 lg:self-center xl:translate-x-10",
  },
  {
    size: "small",
    className:
      "w-[72%] min-w-0 -translate-x-2 self-start lg:w-[55%] lg:-translate-x-4 xl:-translate-x-6",
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

/**
 * Mobile uses one minimal fixed height (~3 lines) for every bubble so the narrow,
 * asymmetric bubbles stay compact and consistent. From `lg` up, the per-size fixed
 * heights keep the polished staggered layout.
 */
const BUBBLE_HEIGHT_CLASS: Record<BubbleSize, string> = {
  large: "h-[7.125rem] lg:h-[12rem]",
  medium: "h-[7.125rem] lg:h-[10rem]",
  small: "h-[7.125rem] lg:h-[9.5rem]",
};

function createInitialCards(quotes: readonly Quote[]): StackCard[] {
  return Array.from({ length: Math.min(3, quotes.length) }, (_, i) => ({
    id: i,
    quoteIndex: i % quotes.length,
  }));
}

const SCROLL_IDLE_MS = 150;

/** Disable layout measurements while the page is moving — keeps Lenis scroll smooth. */
function useScrollIdle() {
  const [idle, setIdle] = useState(true);
  const idleTimerRef = useRef(0);

  useEffect(() => {
    const markActive = () => {
      setIdle(false);
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        setIdle(true);
      }, SCROLL_IDLE_MS);
    };

    const offLenis = subscribeLenisScroll(markActive);
    if (!isLenisActive()) {
      window.addEventListener("scroll", markActive, { passive: true });
    }

    return () => {
      offLenis();
      window.removeEventListener("scroll", markActive);
      window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  return idle;
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
        "relative flex w-full flex-col justify-center rounded-[18px] bg-message-bubble shadow-[0_20px_50px_rgba(0,0,0,0.55)]",
        "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
        BUBBLE_HEIGHT_CLASS[size],
        // Uniform compact padding on mobile; richer per-size padding from lg up.
        "px-5 py-3.5",
        size === "large" && "lg:px-8 lg:py-7",
        size === "medium" && "lg:px-7 lg:py-6",
        size === "small" && "lg:px-6 lg:py-5",
      )}
    >
      <p
        className={cn(
          "font-sans font-normal tracking-[0.18em] text-white/55 uppercase",
          // Same date size for every bubble on mobile.
          "text-xs",
          size === "large" && "lg:text-[0.8rem]",
          size === "medium" && "lg:text-[0.7rem]",
          size === "small" && "lg:text-[0.7rem]",
        )}
      >
        {quote.date}
      </p>
      <p
        className={cn(
          "text-pretty font-sans text-white",
          // Same text size for every bubble on mobile, clamped to keep the fixed height.
          "mt-2 line-clamp-3 text-[0.9375rem] font-medium leading-[1.32] lg:line-clamp-none",
          size === "large" && "lg:mt-4 lg:text-2xl lg:font-semibold",
          size === "medium" && "lg:mt-3 lg:text-xl",
          size === "small" && "lg:mt-2.5 lg:leading-snug lg:text-[0.95rem]",
        )}
      >
        <span className="text-white/90">&ldquo;</span>
        {quote.text}
        <span className="text-white/90">&rdquo;</span>
      </p>
      <span
        className={cn(
          "absolute rotate-45 bg-message-bubble",
          size === "large" && "-bottom-[10px] left-8 size-6",
          size === "medium" && "-bottom-[9px] left-6 size-5",
          size === "small" && "-bottom-[7px] left-5 size-4",
        )}
        aria-hidden
      />
    </Link>
  );
}

function StaticStack({
  cards,
  quotes,
}: {
  cards: StackCard[];
  quotes: readonly Quote[];
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        STACK_GAP_CLASS,
        STACK_TAIL_PADDING,
      )}
    >
      {cards.map((card, slotIndex) => (
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

export function NotificationStack({
  quotes,
  reduceMotion,
  paused = false,
}: {
  quotes: readonly Quote[];
  reduceMotion: boolean;
  paused?: boolean;
}) {
  const scrollIdle = useScrollIdle();
  const scrollIdleRef = useRef(scrollIdle);
  const initialCards = createInitialCards(quotes);
  const [cards, setCards] = useState<StackCard[]>(initialCards);
  const [enteringId, setEnteringId] = useState<number | null>(null);
  const [animationsReady, setAnimationsReady] = useState(false);
  const nextId = useRef(initialCards.length);
  const quoteCursor = useRef(initialCards.length);
  const pendingSwapRef = useRef(false);
  const enteringTimeoutRef = useRef(0);

  useEffect(() => {
    scrollIdleRef.current = scrollIdle;
  }, [scrollIdle]);

  // Let Framer Motion measure slot positions before the first popLayout swap.
  useEffect(() => {
    if (paused || reduceMotion) {
      setAnimationsReady(false);
      return;
    }

    let cancelled = false;
    const warmUpRaf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setAnimationsReady(true);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(warmUpRaf);
    };
  }, [paused, reduceMotion]);

  const canSwap =
    !paused && !reduceMotion && animationsReady && scrollIdle;

  const runSwap = () => {
    if (!scrollIdleRef.current || paused || reduceMotion || !animationsReady) {
      pendingSwapRef.current = true;
      return;
    }

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

    window.clearTimeout(enteringTimeoutRef.current);
    enteringTimeoutRef.current = window.setTimeout(() => {
      setEnteringId(null);
    }, 550);
    pendingSwapRef.current = false;
  };

  useEffect(() => {
    if (!canSwap) return;

    const id = window.setInterval(() => {
      runSwap();
    }, SWAP_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [canSwap, quotes.length]);

  useEffect(() => {
    if (!pendingSwapRef.current || !canSwap) return;
    runSwap();
  }, [canSwap]);

  useEffect(() => {
    return () => window.clearTimeout(enteringTimeoutRef.current);
  }, []);

  if (reduceMotion || paused) {
    return (
      <>
        <StaticStack cards={cards} quotes={quotes} />
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
