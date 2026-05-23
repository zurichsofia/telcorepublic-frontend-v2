"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from "react";

import { useLenis } from "@/components/common/smooth-scroll-provider";
import { HERO_RELEASE_SCROLL_VH } from "@/components/snow-mountain-landing/hero-scroll";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const WHY_CHAPTERS = [
  {
    title: "Decades of Industry Experience",
    paragraphs: [
      "We have worked for leading global analyst research firms, such as Gartner, for decades. We have worked in the industry and followed its market evolution since the 1990s.",
    ],
  },
  {
    title: "Personalized, Responsive and Collaborative",
    paragraphs: [
      "Our services are personalized and flexible, at an attractive price/performance ratio.",
    ],
  },
  {
    title: "Comprehensive Insights",
    paragraphs: [
      "We have supported hundreds of global operators, vendors, investors and tech startups.",
    ],
  },
  {
    title: "Reliable Methodology",
    paragraphs: [
      "We have developed industry models, benchmarks and best practices for users and suppliers to support digital transformation and change management.",
    ],
  },
  {
    title: "Objective, Unbiased, Fact-based",
    paragraphs: [
      "Our mission is to provide unbiased, fact-based and in-depth insights in conjunction with strategic advice.",
    ],
  },
  {
    title: "Extensive Network",
    paragraphs: [
      "Industry leaders rely on our insights and advice. We maintain a strong Senior Executive and C-Level network on a global basis.",
    ],
  },
] as const;

const REVEAL_Y = 56;
const REVEAL_X = 40;
const PROGRESS_EPSILON = 0.004;
const OFFSCREEN_MARGIN_PX = 96;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Cheap smoothstep — avoids cubic-bezier bisection on every scroll frame. */
function revealEase(t: number): number {
  return t * t * (3 - 2 * t);
}

type RevealRange = {
  endVh: number;
  anchorRatio?: number;
};

function revealProgressFromRect(
  rect: DOMRect,
  height: number,
  range: RevealRange,
  vh: number,
): number {
  const anchorY = rect.top + height * (range.anchorRatio ?? 0);
  const rangeStart = vh;
  const rangeEnd = vh * range.endVh;
  const raw = (rangeStart - anchorY) / (rangeStart - rangeEnd);
  return revealEase(clamp(raw, 0, 1));
}

const TITLE_REVEAL: RevealRange = { endVh: 0.58 };
const BODY_REVEAL: RevealRange = { endVh: 0.34, anchorRatio: 0.2 };

type RevealSlot = {
  el: HTMLElement;
  range: RevealRange;
  xDirection: 1 | -1;
  lastProgress: number;
  done: boolean;
};

type RevealRegistry = Map<string, RevealSlot[]>;

function applyRevealStyles(
  el: HTMLElement,
  progress: number,
  xDirection: 1 | -1,
): void {
  const offset = 1 - progress;
  el.style.opacity = String(progress);
  el.style.transform = `translate3d(${offset * REVEAL_X * xDirection}px, ${offset * REVEAL_Y}px, 0)`;
}

function updateRevealSlot(slot: RevealSlot, vh: number): void {
  if (slot.done) return;

  const rect = slot.el.getBoundingClientRect();
  if (rect.bottom < -OFFSCREEN_MARGIN_PX || rect.top > vh + OFFSCREEN_MARGIN_PX) {
    return;
  }

  const progress = revealProgressFromRect(
    rect,
    slot.el.offsetHeight,
    slot.range,
    vh,
  );

  if (Math.abs(progress - slot.lastProgress) < PROGRESS_EPSILON) {
    if (progress >= 1) slot.done = true;
    return;
  }

  slot.lastProgress = progress;
  applyRevealStyles(slot.el, progress, slot.xDirection);

  if (progress >= 1) {
    slot.done = true;
    slot.el.style.willChange = "auto";
  }
}

function WhyChapter({
  title,
  paragraphs,
  variant,
  animate,
  headingId,
  revealKey,
  registryRef,
}: {
  title: string;
  paragraphs: readonly string[];
  variant: "a" | "b";
  animate: boolean;
  headingId?: string;
  revealKey?: string;
  registryRef?: RefObject<RevealRegistry | null>;
}) {
  const isA = variant === "a";
  const xDirection: 1 | -1 = isA ? -1 : 1;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!animate || !revealKey || !registryRef) return;

    const titleEl = titleRef.current;
    const bodyEl = bodyRef.current;
    if (!titleEl || !bodyEl) return;

    const slots: RevealSlot[] = [
      {
        el: titleEl,
        range: TITLE_REVEAL,
        xDirection,
        lastProgress: -1,
        done: false,
      },
      {
        el: bodyEl,
        range: BODY_REVEAL,
        xDirection,
        lastProgress: -1,
        done: false,
      },
    ];

    registryRef.current!.set(revealKey, slots);

    return () => {
      registryRef.current?.delete(revealKey);
    };
  }, [animate, revealKey, registryRef, xDirection]);

  const hiddenStyle = {
    opacity: 0,
    transform: `translate3d(${REVEAL_X * xDirection}px, ${REVEAL_Y}px, 0)`,
  } as const;

  return (
    <div
      className={cn(
        "flex w-full max-w-full flex-col justify-center overflow-x-clip",
        isA
          ? "pl-5 pr-4 md:pl-12 md:pr-8 lg:pl-24 lg:pr-12"
          : "pl-5 pr-4 md:pl-16 md:pr-8 lg:pl-28 lg:pr-16",
      )}
    >
      <div
        className={cn(
          "w-full max-w-3xl space-y-4 md:space-y-5",
          !isA && "ml-auto text-right",
        )}
      >
        <h3
          ref={titleRef}
          id={headingId}
          className={cn(
            "text-pretty font-sans text-xl font-medium leading-normal text-telco-red sm:text-2xl lg:text-3xl",
            !isA && "ml-auto max-w-3xl",
            animate && "will-change-[transform,opacity]",
          )}
          style={animate ? hiddenStyle : undefined}
        >
          {title}
        </h3>
        <div
          ref={bodyRef}
          className={cn(
            "space-y-4 text-pretty font-sans text-base leading-tight tracking-wide text-black lg:text-xl",
            !isA && "ml-auto max-w-3xl",
            animate && "will-change-[transform,opacity]",
          )}
          style={animate ? hiddenStyle : undefined}
        >
          {paragraphs.map((text, j) => (
            <p key={`${title}-${j}`}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WhyUsSection() {
  const lenis = useLenis();
  const reduceMotion = usePrefersReducedMotion();
  const animateRest = Boolean(lenis) && !reduceMotion;
  const revealRegistryRef = useRef<RevealRegistry>(new Map());

  const tickReveals = useCallback(() => {
    const registry = revealRegistryRef.current;
    if (registry.size === 0) return;

    const vh = window.innerHeight;

    registry.forEach((slots) => {
      for (const slot of slots) {
        updateRevealSlot(slot, vh);
      }
    });
  }, []);

  useEffect(() => {
    if (!animateRest || !lenis) return;

    tickReveals();
    const off = lenis.on("scroll", tickReveals);
    return () => off();
  }, [animateRest, lenis, tickReveals]);

  const [first, ...rest] = WHY_CHAPTERS;

  return (
    <section
      id="why-telco-republic"
      className="relative z-20 w-full overflow-x-clip bg-white"
      style={{ marginTop: `-${HERO_RELEASE_SCROLL_VH}vh` }}
      aria-label="Why Telco Republic"
    >
      <div
        id="why-us-first-screen"
        className="flex h-screen min-h-screen w-full flex-col justify-center pt-24"
        aria-labelledby="why-us-entry"
      >
        <WhyChapter
          title={first.title}
          paragraphs={first.paragraphs}
          variant="a"
          animate={false}
          headingId="why-us-entry"
        />
      </div>

      <div
        id="why-us-rest"
        className="flex w-full flex-col space-y-12 pb-8 md:space-y-20"
      >
        {rest.map((chapter, i) => (
          <div key={chapter.title} className="py-8 md:py-12">
            <WhyChapter
              title={chapter.title}
              paragraphs={chapter.paragraphs}
              variant={(i + 1) % 2 === 0 ? "a" : "b"}
              animate={animateRest}
              revealKey={chapter.title}
              registryRef={revealRegistryRef}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
