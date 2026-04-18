"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { Swiper as SwiperType } from "swiper";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Swiper's internal width can be 0 or stale during layout; bad values blow up parallax and shift video off-screen. */
function heroSlideWidth(swiper: SwiperType): number {
  const el = swiper.el;
  const inner = Math.round(Number(swiper.width) || 0);
  if (!el) return Math.max(1, inner);
  const rect = Math.round(el.getBoundingClientRect().width);
  const client = Math.round(el.clientWidth || 0);
  return Math.max(1, inner, rect, client);
}

export type UseServiceVideoHeroParams = {
  sectionCount: number;
  reduceMotion: boolean | null;
  initialSlide: number;
};

export function useServiceVideoHero({
  sectionCount,
  reduceMotion,
  initialSlide,
}: UseServiceVideoHeroParams) {
  const swiperRef = useRef<SwiperType | null>(null);
  const titleSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const axisLineRef = useRef<HTMLDivElement>(null);
  const lastRoundedRef = useRef(initialSlide);
  const reduceMotionRef = useRef(!!reduceMotion);
  const isDraggingAxisRef = useRef(false);
  /** True after first `sliderMove` until `touchEnd` — carousel drag (ignored while axis drives translate). */
  const swiperDraggingRef = useRef(false);
  const targetXRef = useRef(0);
  const dragCleanupRef = useRef<null | (() => void)>(null);
  const lastParallaxAttrKeyRef = useRef("");

  const [isDragging, setIsDragging] = useState(false);
  const [chromeIndex, setChromeIndex] = useState(initialSlide);

  useEffect(() => {
    reduceMotionRef.current = !!reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    lastRoundedRef.current = initialSlide;
    setChromeIndex(initialSlide);
  }, [initialSlide]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    const target = clamp(initialSlide, 0, Math.max(0, sectionCount - 1));
    if (swiper.activeIndex !== target) {
      swiper.slideTo(target, reduceMotionRef.current ? 0 : 0);
    }
  }, [initialSlide, sectionCount]);

  const paint = useCallback(
    (swiper: SwiperType) => {
      const w = heroSlideWidth(swiper);
      const tr =
        typeof swiper.translate === "number" && !Number.isNaN(swiper.translate)
          ? swiper.translate
          : 0;
      const maxScroll = Math.max(0, (sectionCount - 1) * w);
      const scrollX = clamp(-tr, 0, maxScroll);
      const rm = reduceMotionRef.current;
      const parallaxKey = `${w}:${rm}`;
      if (parallaxKey !== lastParallaxAttrKeyRef.current && swiper.el) {
        lastParallaxAttrKeyRef.current = parallaxKey;
        const px = rm ? 0 : w * 0.08;
        swiper.el
          .querySelectorAll<HTMLElement>("[data-parallax-video]")
          .forEach((el) => el.setAttribute("data-swiper-parallax-x", String(px)));
        queueMicrotask(() => {
          if (swiperRef.current !== swiper) return;
          const alive = swiper as SwiperType & { destroyed?: boolean; };
          if (alive.destroyed) return;
          swiper.setTranslate(swiper.translate);
        });
      }
      const continuousIdx = scrollX / (w || 1);
      titleSlideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const offset = i - continuousIdx;
        slide.style.transform = `translate3d(${offset * 95}%, 0, 0) scale(${clamp(1 - Math.abs(offset) * 0.15, 0.72, 1)})`;
        // slide.style.opacity = String(clamp(1 - Math.abs(offset) * 1.2, 0, 1));
      });
      const rounded = clamp(
        Math.round(scrollX / (w || 1)),
        0,
        sectionCount - 1,
      );
      if (rounded !== lastRoundedRef.current) {
        lastRoundedRef.current = rounded;
        setChromeIndex(rounded);
      }
    },
    [sectionCount],
  );

  const repaint = useCallback(() => {
    const s = swiperRef.current;
    if (!s) return;
    s.update();
    const w = heroSlideWidth(s);
    s.el.style.setProperty("--service-hero-slide-px", `${w}px`);
    paint(s);
  }, [paint]);

  const maxScrollForWidth = useCallback(
    (w: number) => Math.max(0, (sectionCount - 1) * w),
    [sectionCount],
  );

  const endAxisDrag = useCallback(() => {
    if (!isDraggingAxisRef.current) return;
    isDraggingAxisRef.current = false;
    setIsDragging(swiperDraggingRef.current);

    const swiper = swiperRef.current;
    if (!swiper) return;

    const w = heroSlideWidth(swiper);
    const target = clamp(
      Math.round(targetXRef.current / w),
      0,
      sectionCount - 1,
    );
    swiper.slideTo(target, reduceMotionRef.current ? 0 : 380);
  }, [sectionCount]);

  const beginAxisDrag = useCallback(
    (captureEl: HTMLElement | null, pointerId: number) => {
      dragCleanupRef.current?.();
      dragCleanupRef.current = null;

      const swiper = swiperRef.current;
      if (!swiper || !axisLineRef.current) return;

      isDraggingAxisRef.current = true;
      setIsDragging(true);

      const pid = pointerId;

      const onMove = (e: PointerEvent) => {
        if (!isDraggingAxisRef.current || e.pointerId !== pid) return;
        e.preventDefault();
        const line = axisLineRef.current;
        const sw = swiperRef.current;
        if (!line || !sw) return;

        const rect = line.getBoundingClientRect();
        const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        const m = maxScrollForWidth(heroSlideWidth(sw));
        targetXRef.current = ratio * m;
        sw.setTranslate(-targetXRef.current);
        paint(sw);
      };

      const detach = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        dragCleanupRef.current = null;
      };

      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== pid) return;
        detach();
        try {
          captureEl?.releasePointerCapture(pid);
        } catch {
          /* noop */
        }
        endAxisDrag();
      };

      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      dragCleanupRef.current = detach;
    },
    [endAxisDrag, maxScrollForWidth, paint],
  );

  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);

  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      lastParallaxAttrKeyRef.current = "";

      const run = () => {
        const nw = heroSlideWidth(swiper);
        swiper.el.style.setProperty("--service-hero-slide-px", `${nw}px`);
        paint(swiper);
      };

      swiper.on("setTranslate", run);
      swiper.on("resize", run);

      const onSliderMove = () => {
        if (isDraggingAxisRef.current) return;
        if (!swiperDraggingRef.current) {
          swiperDraggingRef.current = true;
          setIsDragging(true);
        }
      };

      const onTouchEnd = () => {
        swiperDraggingRef.current = false;
        setIsDragging(isDraggingAxisRef.current);
      };

      swiper.on("sliderMove", onSliderMove);
      swiper.on("touchEnd", onTouchEnd);

      const onWinResize = () => {
        swiper.update();
        run();
      };
      window.addEventListener("resize", onWinResize);

      swiper.on("destroy", () => {
        swiperDraggingRef.current = false;
        swiper.off("setTranslate", run);
        swiper.off("resize", run);
        swiper.off("sliderMove", onSliderMove);
        swiper.off("touchEnd", onTouchEnd);
        window.removeEventListener("resize", onWinResize);
      });

      run();
      requestAnimationFrame(() => {
        swiper.update();
        paint(swiper);
        swiper.update();
        paint(swiper);
      });
    },
    [paint],
  );

  useLayoutEffect(() => {
    repaint();
  }, [repaint, initialSlide]);

  const onAxisPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.stopPropagation();
      const line = axisLineRef.current;
      const swiper = swiperRef.current;
      if (!line || !swiper) return;

      const rect = line.getBoundingClientRect();
      const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const w = heroSlideWidth(swiper);
      const m = maxScrollForWidth(w);
      targetXRef.current = ratio * m;
      swiper.setTranslate(-targetXRef.current);
      paint(swiper);

      const captureEl = e.currentTarget as HTMLDivElement;
      captureEl.setPointerCapture(e.pointerId);
      beginAxisDrag(captureEl, e.pointerId);
    },
    [beginAxisDrag, maxScrollForWidth, paint],
  );

  const onAxisKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const swiper = swiperRef.current;
      if (!swiper) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        swiper.slideNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        swiper.slidePrev();
      }
    },
    [],
  );

  return {
    chromeIndex,
    titleSlideRefs,
    axisLineRef,
    isDragging,
    onSwiper,
    onAxisPointerDown,
    onAxisKeyDown,
  };
}
