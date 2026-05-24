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

export const SCROLL_REVEAL_DEFAULTS = {
  x: 28,
  y: 36,
  enterTopVh: 0.9,
  enterMinBottomVh: 0.06,
  stiffness: 82,
  damping: 21,
  mass: 0.78,
};

export type ScrollRevealThresholds = {
  enterTopVh?: number;
  enterMinBottomVh?: number;
};

export type ScrollRevealMotionOptions = ScrollRevealThresholds & {
  xDirection?: 1 | -1;
  revealX?: number;
  revealY?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  /** Keep content visible after first reveal (default: true). */
  once?: boolean;
};

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

function springTransition(
  delay: number,
  {
    stiffness = SCROLL_REVEAL_DEFAULTS.stiffness,
    damping = SCROLL_REVEAL_DEFAULTS.damping,
    mass = SCROLL_REVEAL_DEFAULTS.mass,
  }: Pick<
    ScrollRevealMotionOptions,
    "stiffness" | "damping" | "mass"
  > = {},
): Transition {
  return {
    type: "spring",
    stiffness,
    damping,
    mass,
    delay,
  };
}

/** Reveal on enter via IntersectionObserver — no per-frame scroll work. */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  {
    enterTopVh = SCROLL_REVEAL_DEFAULTS.enterTopVh,
    enterMinBottomVh = SCROLL_REVEAL_DEFAULTS.enterMinBottomVh,
    once = true,
  }: ScrollRevealThresholds & { once?: boolean } = {},
): boolean {
  const [visible, setVisible] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (once && revealedRef.current) {
      setVisible(true);
      return;
    }

    const bottomMarginPct = Math.round((1 - enterTopVh) * 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          if (!once) setVisible(false);
          return;
        }

        const vh = window.innerHeight;
        const { top, bottom } = entry.boundingClientRect;
        const entering =
          top < vh * enterTopVh && bottom > vh * enterMinBottomVh;

        if (!entering) return;

        revealedRef.current = true;
        setVisible(true);
        if (once) observer.disconnect();
      },
      {
        root: null,
        rootMargin: `0px 0px -${bottomMarginPct}% 0px`,
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enterMinBottomVh, enterTopVh, once, ref]);

  return visible;
}

type ScrollRevealContextValue = {
  inView: boolean;
  variants: Variants;
  spring: Pick<ScrollRevealMotionOptions, "stiffness" | "damping" | "mass">;
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
  once = true,
  xDirection = -1,
  revealX = SCROLL_REVEAL_DEFAULTS.x,
  revealY = SCROLL_REVEAL_DEFAULTS.y,
  stiffness = SCROLL_REVEAL_DEFAULTS.stiffness,
  damping = SCROLL_REVEAL_DEFAULTS.damping,
  mass = SCROLL_REVEAL_DEFAULTS.mass,
  enterTopVh,
  enterMinBottomVh,
}: ScrollRevealRootProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useScrollReveal(ref, { enterTopVh, enterMinBottomVh, once });

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const value: ScrollRevealContextValue = {
    inView,
    variants: scrollRevealVariants(revealX, revealY, xDirection),
    spring: { stiffness, damping, mass },
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
  const show = ctx.inView;

  return (
    <MotionTag
      id={id}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={ctx.variants}
      transition={
        show
          ? springTransition(delay, ctx.spring)
          : { duration: 0 }
      }
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/** Scroll-triggered fade/slide reveal — IO-triggered, spring-animated on enter. */
export const ScrollReveal = Object.assign(ScrollRevealRoot, {
  Item: ScrollRevealItem,
});
