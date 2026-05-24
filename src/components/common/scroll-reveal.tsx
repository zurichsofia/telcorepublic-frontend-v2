"use client";

import {
  motion,
  useMotionValue,
  type MotionValue,
  type Transition,
  type Variants,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

import { useLenis } from "@/components/common/smooth-scroll-provider";
import { subscribeLenisScroll } from "@/lib/lenis-scroll";

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

    // enterTopVh < 1 shrinks the root (later reveal); > 1 expands downward (earlier reveal).
    const bottomRootMarginPct = Math.round((enterTopVh - 1) * 100);
    const rootMargin = `0px 0px ${bottomRootMarginPct}% 0px`;

    let observer: IntersectionObserver | undefined;
    let offScroll: (() => void) | undefined;

    const tryReveal = () => {
      if (once && revealedRef.current) return;

      const vh = window.innerHeight;
      const { top, bottom } = node.getBoundingClientRect();
      const entering =
        top < vh * enterTopVh && bottom > vh * enterMinBottomVh;

      if (!entering) return;

      revealedRef.current = true;
      setVisible(true);
      observer?.disconnect();
      offScroll?.();
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          if (!once) setVisible(false);
          return;
        }
        tryReveal();
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(node);
    offScroll = subscribeLenisScroll(tryReveal);
    tryReveal();

    return () => {
      observer?.disconnect();
      offScroll?.();
    };
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

type ScrollRevealRootProps = ScrollRevealMotionOptions &
  Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    children: ReactNode;
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
  ...rest
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
      <div ref={ref} className={className} {...rest}>
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

function smoothstep01(t: number): number {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
}

export type ScrollLinkedRevealOptions = {
  /** Element center reaches full opacity at this viewport fraction (default ~center). */
  completeAtVh?: number;
  /** Reveal begins when element center is at or below this viewport fraction. */
  startAtVh?: number;
  /** Delays the ramp as a 0–1 fraction (positive = later). */
  lead?: number;
};

/**
 * Scroll-linked editorial reveal — maps element position to 0–1 progress.
 * Pairs with continuous parallax backdrops (no spring snap on enter).
 */
export function getScrollLinkedRevealProgress(
  rect: DOMRect,
  vh: number,
  {
    completeAtVh = 0.5,
    startAtVh = 0.94,
    lead = 0,
  }: ScrollLinkedRevealOptions = {},
): number {
  const center = rect.top + rect.height / 2;
  const completeAt = vh * completeAtVh;
  const startAt = vh * startAtVh;
  const span = Math.max(startAt - completeAt, 1);
  const raw = (startAt - center) / span - lead;
  return smoothstep01(raw);
}

export function scrollLinkedRevealStyle(
  progress: number,
  driftPx = 22,
): Pick<CSSProperties, "opacity" | "transform"> {
  return {
    opacity: progress,
    transform: `translate3d(0, ${(1 - progress) * driftPx}px, 0)`,
  };
}

export type LenisScrollLinkedMotionOptions = ScrollLinkedRevealOptions & {
  driftPx?: number;
  disabled?: boolean;
};

/**
 * Lenis-synced enter reveal — maps scroll position to opacity/y MotionValues.
 * Motion's useScroll does not track Lenis interpolation; this listens to lenis.on("scroll").
 */
export function useLenisScrollLinkedMotion(
  ref: RefObject<HTMLElement | null>,
  {
    completeAtVh = 0.48,
    startAtVh = 0.94,
    lead = 0,
    driftPx = 44,
    disabled = false,
  }: LenisScrollLinkedMotionOptions = {},
): { opacity: MotionValue<number>; y: MotionValue<number>; } {
  const lenis = useLenis();
  const opacity = useMotionValue(disabled ? 1 : 0);
  const y = useMotionValue(disabled ? 0 : driftPx);

  useLayoutEffect(() => {
    if (disabled) {
      opacity.set(1);
      y.set(0);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const sync = () => {
      const rect = node.getBoundingClientRect();
      const progress = getScrollLinkedRevealProgress(rect, window.innerHeight, {
        completeAtVh,
        startAtVh,
        lead,
      });
      opacity.set(progress);
      y.set((1 - progress) * driftPx);
    };

    sync();

    const offLenis = lenis?.on("scroll", sync);
    if (!lenis) {
      window.addEventListener("scroll", sync, { passive: true });
    }
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      offLenis?.();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [
    completeAtVh,
    disabled,
    driftPx,
    lead,
    lenis,
    opacity,
    ref,
    startAtVh,
    y,
  ]);

  return { opacity, y };
}

type ScrollLinkedRevealProps = LenisScrollLinkedMotionOptions &
  Omit<React.ComponentPropsWithoutRef<typeof motion.div>, "children"> & {
    children: ReactNode;
  };

/** Continuous scroll-linked fade/slide — pairs with Lenis and parallax backdrops. */
export function ScrollLinkedReveal({
  children,
  className,
  disabled,
  completeAtVh,
  startAtVh,
  lead,
  driftPx,
  ...rest
}: ScrollLinkedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { opacity, y } = useLenisScrollLinkedMotion(ref, {
    completeAtVh,
    startAtVh,
    lead,
    driftPx,
    disabled,
  });

  if (disabled) {
    return (
      <div className={className} {...(rest as React.ComponentPropsWithoutRef<"div">)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ opacity, y }} {...rest}>
      {children}
    </motion.div>
  );
}
