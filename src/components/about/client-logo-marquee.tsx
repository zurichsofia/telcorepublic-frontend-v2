"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import { clientLogos, type ClientLogo } from "@/data/clients";
import { cn } from "@/lib/utils";

const MARQUEE_DURATION_MS = 35_000;

type ClientLogoMarqueeVariant = "default" | "inverse";

function ClientLogoItem({
  client,
  variant,
}: {
  client: ClientLogo;
  variant: ClientLogoMarqueeVariant;
}) {
  const scale = client.scale ?? 1;

  return (
    <div className="flex shrink-0 items-center justify-center px-10 sm:px-12 lg:px-14">
      <Image
        src={client.src}
        alt={client.name}
        width={client.width}
        height={client.height}
        className={cn(
          "h-20 w-auto object-contain sm:h-24 lg:h-28",
          variant === "inverse" && "brightness-0 invert",
        )}
        style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      />
    </div>
  );
}

function ClientLogoSet({
  variant,
}: {
  variant: ClientLogoMarqueeVariant;
}) {
  return (
    <>
      {clientLogos.map((client) => (
        <ClientLogoItem key={client.name} client={client} variant={variant} />
      ))}
    </>
  );
}

export function ClientLogoMarquee({
  variant = "default",
  label,
  labelClassName,
  className,
}: {
  variant?: ClientLogoMarqueeVariant;
  label?: string;
  labelClassName?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let setWidth = set.getBoundingClientRect().width;
    let offset = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const applyTransform = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const tick = (now: number) => {
      const deltaMs = Math.min(now - lastTime, 50);
      lastTime = now;

      offset -= (setWidth / MARQUEE_DURATION_MS) * deltaMs;
      while (offset <= -setWidth) {
        offset += setWidth;
      }

      applyTransform();
      rafId = requestAnimationFrame(tick);
    };

    const syncSetWidth = () => {
      const nextWidth = set.getBoundingClientRect().width;
      if (nextWidth <= 0) return;

      if (setWidth > 0) {
        const progress = Math.abs(offset) / setWidth;
        offset = -progress * nextWidth;
      }

      setWidth = nextWidth;
      applyTransform();
    };

    syncSetWidth();

    const resizeObserver = new ResizeObserver(syncSetWidth);
    resizeObserver.observe(set);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      track.style.transform = "";
    };
  }, []);

  return (
    <div
      className={cn("relative", className)}
      aria-label="Client logos"
      role="region"
    >
      {label ? (
        <p className={cn("absolute z-10", labelClassName)}>{label}</p>
      ) : null}
      <div
        className={cn(
          "client-logo-marquee relative w-full overflow-hidden",
          variant === "default" && "py-8 sm:py-10",
        )}
      >
        <div
          ref={trackRef}
          className="client-logo-marquee-track flex w-max items-center"
        >
          <div
            ref={setRef}
            className="client-logo-marquee-set flex shrink-0 items-center"
          >
            <ClientLogoSet variant={variant} />
          </div>
          <div
            className="client-logo-marquee-set flex shrink-0 items-center"
            aria-hidden
          >
            <ClientLogoSet variant={variant} />
          </div>
        </div>
      </div>
    </div>
  );
}
