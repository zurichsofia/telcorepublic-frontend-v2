"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

import { getScrollLinkedRevealProgress } from "@/components/common/scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  getLenisScrollY,
  isLenisActive,
  isUserScrollIntentActive,
  subscribeLenisScroll,
} from "@/lib/lenis-scroll";
import { cn } from "@/lib/utils";

const REVEAL = {
  startAtVh: 0.92,
  completeAtVh: 0.5,
  driftPx: 36,
} as const;

/** Ignore Lenis micro-lerp after the user stops — prevents shimmer on resume. */
const SETTLE_SCROLL_PX = 0.85;
const SETTLE_SYNC_MS = 200;

type ChapterEntry = {
  node: HTMLDivElement;
};

type RegisterChapter = (entry: ChapterEntry) => () => void;

const WhyUsRevealContext = createContext<RegisterChapter | null>(null);

function applyChapterStyles(node: HTMLDivElement, progress: number) {
  const y = Math.round((1 - progress) * REVEAL.driftPx);
  node.style.opacity = String(progress);
  node.style.transform =
    y === 0 ? "translate3d(0, 0, 0)" : `translate3d(0, ${y}px, 0)`;
}

function WhyUsRevealProvider({ children }: { children: ReactNode }) {
  const entriesRef = useRef(new Set<ChapterEntry>());
  const lastScrollYRef = useRef(-1);
  const settleTimerRef = useRef(0);

  const register = useCallback<RegisterChapter>((entry) => {
    entriesRef.current.add(entry);
    return () => entriesRef.current.delete(entry);
  }, []);

  useLayoutEffect(() => {
    const applySync = (force = false) => {
      const scrollY = getLenisScrollY();
      const lastScrollY = lastScrollYRef.current;
      const delta =
        lastScrollY < 0 ? SETTLE_SCROLL_PX : Math.abs(scrollY - lastScrollY);

      if (!force && delta < SETTLE_SCROLL_PX && !isUserScrollIntentActive()) {
        return;
      }

      lastScrollYRef.current = scrollY;

      const vh = window.innerHeight;
      for (const { node } of entriesRef.current) {
        const progress = getScrollLinkedRevealProgress(
          node.getBoundingClientRect(),
          vh,
          REVEAL,
        );
        applyChapterStyles(node, progress);
      }
    };

    const scheduleSettleSync = () => {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(() => {
        lastScrollYRef.current = -1;
        applySync(true);
      }, SETTLE_SYNC_MS);
    };

    const scheduleSync = () => {
      scheduleSettleSync();
      applySync(false);
    };

    const onResize = () => applySync(true);

    applySync(true);

    const offLenis = subscribeLenisScroll(scheduleSync);
    if (!isLenisActive()) {
      window.addEventListener("scroll", scheduleSync, { passive: true });
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      offLenis();
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settleTimerRef.current);
    };
  }, []);

  return (
    <WhyUsRevealContext.Provider value={register}>
      {children}
    </WhyUsRevealContext.Provider>
  );
}

type WhyUsChapterItemProps = {
  title: string;
  paragraphs: readonly string[];
  alignRight?: boolean;
  disabled?: boolean;
};

function WhyUsChapterItem({
  title,
  paragraphs,
  alignRight = false,
  disabled = false,
}: WhyUsChapterItemProps) {
  const register = useContext(WhyUsRevealContext);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (disabled) {
      applyChapterStyles(node, 1);
      return;
    }

    if (!register) return;

    return register({ node });
  }, [disabled, register]);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full py-20 sm:py-14 md:py-24",
        alignRight
          ? "max-w-[90%] self-end md:max-w-none"
          : "max-w-[90%] self-start md:max-w-none",
      )}
      style={
        disabled
          ? undefined
          : { opacity: 0, transform: `translate3d(0, ${REVEAL.driftPx}px, 0)` }
      }
    >
      <div
        className={cn(
          "flex flex-col overflow-x-clip text-left lg:max-w-3xl",
          alignRight && "md:ml-auto md:text-right",
        )}
      >
        <h3 className="text-pretty text-3xl font-medium leading-normal text-telco-red sm:text-2xl lg:text-3xl">
          {title}
        </h3>
        <div className="text-pretty text-2xl leading-tight text-telco-dark md:text-2xl lg:text-justify">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export type WhyUsChapterData = {
  title: string;
  paragraphs: readonly string[];
};

export function WhyUsChapters({
  chapters,
}: {
  chapters: readonly WhyUsChapterData[];
}) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return (
      <>
        {chapters.map((chapter, index) => (
          <WhyUsChapterItem
            key={chapter.title}
            {...chapter}
            alignRight={index % 2 === 1}
            disabled
          />
        ))}
      </>
    );
  }

  return (
    <WhyUsRevealProvider>
      {chapters.map((chapter, index) => (
        <WhyUsChapterItem
          key={chapter.title}
          {...chapter}
          alignRight={index % 2 === 1}
        />
      ))}
    </WhyUsRevealProvider>
  );
}
