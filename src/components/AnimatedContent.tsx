"use client";

import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface AnimatedContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
  container?: Element | string | null;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  /** When set (and non-zero on either axis), animates from this translate to 0; overrides `distance` / `direction` / `reverse`. */
  translateFrom?: { x: number; y: number; };
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  /**
   * Use this as ScrollTrigger `trigger` when the animated node lives inside `position: sticky`
   * (the sticky child’s box can pin in the viewport and confuse scroll-based measurements).
   */
  scrollTriggerRef?: RefObject<HTMLElement | null>;
  /** Passed to ScrollTrigger as `start` when set (e.g. `"top 88%"`). Overrides threshold-based start. */
  start?: string;
  delay?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
}

const AnimatedContent = forwardRef<HTMLDivElement, AnimatedContentProps>(
  function AnimatedContent(
    {
      children,
      container,
      distance = 100,
      direction = "vertical",
      reverse = false,
      translateFrom,
      duration = 0.8,
      ease = "power3.out",
      initialOpacity = 0,
      animateOpacity = true,
      scale = 1,
      threshold = 0.1,
      scrollTriggerRef,
      start: startOverride,
      delay = 0,
      disappearAfter = 0,
      disappearDuration = 0.5,
      disappearEase = "power3.in",
      onComplete,
      onDisappearanceComplete,
      className = "",
      style,
      ...props
    },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLDivElement>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      let scrollerTarget: Element | string | null =
        container ?? document.getElementById("snap-main-container") ?? null;

      if (typeof scrollerTarget === "string") {
        scrollerTarget = document.querySelector(scrollerTarget);
      }

      const useTranslateFrom =
        translateFrom != null &&
        (translateFrom.x !== 0 || translateFrom.y !== 0);

      const axis = direction === "horizontal" ? "x" : "y";
      const offset = reverse ? -distance : distance;
      const startPct = (1 - threshold) * 100;
      const scrollStart = startOverride ?? `top ${startPct}%`;

      const triggerRoot = scrollTriggerRef?.current ?? el;

      const ctx = gsap.context(() => {
        if (useTranslateFrom) {
          gsap.set(el, {
            x: translateFrom!.x,
            y: translateFrom!.y,
            scale,
            opacity: animateOpacity ? initialOpacity : 1,
            visibility: "visible",
          });
        } else {
          gsap.set(el, {
            [axis]: offset,
            scale,
            opacity: animateOpacity ? initialOpacity : 1,
            visibility: "visible",
          });
        }

        const tl = gsap.timeline({
          paused: true,
          delay,
          onComplete: () => {
            onComplete?.();
            if (disappearAfter > 0) {
              gsap.to(el, {
                ...(useTranslateFrom
                  ? { x: -translateFrom!.x, y: -translateFrom!.y }
                  : { [axis]: reverse ? distance : -distance }),
                scale: 0.8,
                opacity: animateOpacity ? initialOpacity : 0,
                delay: disappearAfter,
                duration: disappearDuration,
                ease: disappearEase,
                onComplete: () => onDisappearanceComplete?.(),
              });
            }
          },
        });

        if (useTranslateFrom) {
          tl.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration,
            ease,
          });
        } else {
          tl.to(el, {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration,
            ease,
          });
        }

        ScrollTrigger.create({
          trigger: triggerRoot,
          scroller: scrollerTarget ?? window,
          start: scrollStart,
          once: true,
          onEnter: () => {
            tl.play();
          },
        });
      }, el);

      return () => ctx.revert();
    }, [
      animateOpacity,
      container,
      delay,
      direction,
      disappearAfter,
      disappearDuration,
      disappearEase,
      distance,
      duration,
      ease,
      initialOpacity,
      onComplete,
      onDisappearanceComplete,
      reverse,
      scale,
      scrollTriggerRef,
      startOverride,
      threshold,
      translateFrom,
    ]);

    return (
      <div
        ref={mergedRef}
        className={className}
        style={{ visibility: "hidden", ...style }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AnimatedContent.displayName = "AnimatedContent";

export default AnimatedContent;
