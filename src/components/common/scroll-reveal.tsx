"use client";

import {
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { useLenis } from "@/components/common/smooth-scroll-provider";

export const SCROLL_REVEAL_DEFAULTS = {
  x: 40,
  y: 56,
  enterTopVh: 0.88,
  enterMinBottomVh: 0.02,
  duration: 0.85,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

export type ScrollRevealThresholds = {
  enterTopVh?: number;
  enterMinBottomVh?: number;
};

export type ScrollRevealMotionOptions = ScrollRevealThresholds & {
  xDirection?: 1 | -1;
  revealX?: number;
  revealY?: number;
  duration?: number;
};

const INSTANT_TRANSITION: Transition = { duration: 0 };

function scrollRevealVariants(
  revealX: number,
  revealY: number,
  xDirection: 1 | -1,
): Variants {
  return {
    hidden: {
      opacity: 0,
      x: revealX * xDirection,
      y: revealY,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
}

/** Tracks scroll position and toggles visibility for enter / instant reset. */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  {
    enterTopVh = SCROLL_REVEAL_DEFAULTS.enterTopVh,
    enterMinBottomVh = SCROLL_REVEAL_DEFAULTS.enterMinBottomVh,
  }: ScrollRevealThresholds = {},
): boolean {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const node = ref.current;
      if (!node) return;

      const vh = window.innerHeight;
      const { top, bottom } = node.getBoundingClientRect();

      setVisible((prev) => {
        if (!prev) {
          return (
            top < vh * enterTopVh && bottom > vh * enterMinBottomVh
          );
        }
        return bottom > 0 && top < vh;
      });
    };

    check();
    if (lenis) return lenis.on("scroll", check);

    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [enterMinBottomVh, enterTopVh, lenis, ref]);

  return visible;
}

type ScrollRevealContextValue = {
  inView: boolean;
  variants: Variants;
  enterTransition: Transition;
};

const ScrollRevealContext = createContext<ScrollRevealContextValue | null>(
  null,
);

type ScrollRevealRootProps = ScrollRevealMotionOptions & {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

function ScrollRevealRoot({
  children,
  className,
  disabled = false,
  xDirection = -1,
  revealX = SCROLL_REVEAL_DEFAULTS.x,
  revealY = SCROLL_REVEAL_DEFAULTS.y,
  duration = SCROLL_REVEAL_DEFAULTS.duration,
  enterTopVh,
  enterMinBottomVh,
}: ScrollRevealRootProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useScrollReveal(ref, { enterTopVh, enterMinBottomVh });

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const value: ScrollRevealContextValue = {
    inView,
    variants: scrollRevealVariants(revealX, revealY, xDirection),
    enterTransition: {
      duration,
      ease: [...SCROLL_REVEAL_DEFAULTS.ease],
    },
  };

  return (
    <ScrollRevealContext.Provider value={value}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </ScrollRevealContext.Provider>
  );
}

const MOTION_TAGS = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

export type ScrollRevealItemTag = keyof typeof MOTION_TAGS;

type ScrollRevealItemProps = {
  as?: ScrollRevealItemTag;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
};

function ScrollRevealItem({
  as = "div",
  delay = 0,
  className,
  children,
  id,
}: ScrollRevealItemProps) {
  const ctx = useContext(ScrollRevealContext);

  if (!ctx) {
    const StaticTag = as;
    return (
      <StaticTag className={className} id={id}>
        {children}
      </StaticTag>
    );
  }

  const MotionTag = MOTION_TAGS[as];

  return (
    <MotionTag
      id={id}
      initial="hidden"
      animate={ctx.inView ? "visible" : "hidden"}
      variants={ctx.variants}
      transition={
        ctx.inView
          ? { ...ctx.enterTransition, delay }
          : INSTANT_TRANSITION
      }
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/** Scroll-triggered fade/slide reveal — wraps a block and animates items on enter. */
export const ScrollReveal = Object.assign(ScrollRevealRoot, {
  Item: ScrollRevealItem,
});
