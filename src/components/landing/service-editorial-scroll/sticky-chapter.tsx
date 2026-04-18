"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedContent from "@/components/AnimatedContent";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function StickyChapter({
  stickyClassName,
  motionClassName,
  children,
}: {
  stickyClassName?: string;
  motionClassName?: string;
  children: ReactNode;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollFadeLayerRef = useRef<HTMLDivElement>(null);
  const scrollFadeRef = useRef<ScrollTrigger | null>(null);

  const shellClassName =
    "flex w-full min-w-0 max-w-full flex-col self-stretch";
  const innerClassName = cn(shellClassName, motionClassName);

  const wireScrollFade = useCallback(() => {
    const track = trackRef.current;
    const fadeLayer = scrollFadeLayerRef.current;
    if (!track || !fadeLayer) return;

    scrollFadeRef.current?.kill();
    scrollFadeRef.current = null;

    const tween = gsap.fromTo(
      fadeLayer,
      { opacity: 1 },
      { opacity: 0, ease: "none" },
    );

    scrollFadeRef.current = ScrollTrigger.create({
      trigger: track,
      scroller: window,
      start: "top top",
      end: "bottom top",
      scrub: true,
      animation: tween,
    });
  }, []);

  useEffect(() => {
    return () => {
      scrollFadeRef.current?.kill();
      scrollFadeRef.current = null;
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="relative min-h-[82svh] w-full overflow-x-clip overflow-y-visible bg-white"
    >
      <div
        className={cn(
          "sticky top-0 z-0 flex min-h-[76svh] w-full max-w-full flex-col overflow-visible bg-white text-black",
          stickyClassName,
        )}
      >
        {reduceMotion ? (
          <div className={innerClassName}>{children}</div>
        ) : (
          <div ref={scrollFadeLayerRef} className={innerClassName}>
            <AnimatedContent
              scrollTriggerRef={trackRef}
              className="relative flex min-h-0 w-full flex-1 flex-col"
              distance={80}
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              threshold={0.22}
              onComplete={wireScrollFade}
            >
              {children}
            </AnimatedContent>
          </div>
        )}
      </div>
    </div>
  );
}
