"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  resetScrollPosition,
  useLenis,
} from "@/components/common/smooth-scroll-provider";
import { ServiceDetails } from "@/components/service/service-details/service-details";
import { getServiceBySlug } from "@/data/services";
import { ServiceVideoHeroV2 } from "@/components/service/service-video-hero/service-video-hero-v2";

function slugFromPathname(pathname: string): string | undefined {
  const m = pathname.match(/^\/services\/([^/]+)/);
  if (!m?.[1]) return undefined;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

export type ServiceWrapperProps = {
  initialSlug: string;
};

export function ServiceWrapper({ initialSlug }: ServiceWrapperProps) {
  const lenis = useLenis();
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const lastServerSlugRef = useRef(initialSlug);

  useEffect(() => {
    if (lastServerSlugRef.current === initialSlug) return;
    lastServerSlugRef.current = initialSlug;
    setActiveSlug(initialSlug);
    resetScrollPosition(lenis);
    if (!lenis) return;
    const resizeRaf = requestAnimationFrame(() => {
      lenis.resize();
    });
    return () => cancelAnimationFrame(resizeRaf);
  }, [initialSlug, lenis]);

  useEffect(() => {
    const onPopState = () => {
      const fromUrl = slugFromPathname(window.location.pathname);
      if (fromUrl && getServiceBySlug(fromUrl)) {
        setActiveSlug(fromUrl);
        resetScrollPosition(lenis);
        if (lenis) {
          requestAnimationFrame(() => lenis.resize());
        }
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [lenis]);

  // Carousel URL sync swaps content height — resize Lenis without jumping scroll.
  useEffect(() => {
    if (!lenis) return;
    const resizeRaf = requestAnimationFrame(() => {
      lenis.resize();
    });
    return () => cancelAnimationFrame(resizeRaf);
  }, [activeSlug, lenis]);

  const onActiveServiceChange = useCallback((slug: string) => {
    setActiveSlug((current) => (current === slug ? current : slug));
  }, []);

  const service = getServiceBySlug(activeSlug) ?? getServiceBySlug(initialSlug);

  if (!service) return null;

  return (
    <>
      <ServiceVideoHeroV2
        initialSlug={activeSlug}
        onActiveServiceChange={onActiveServiceChange}
      />
      <div id="service-detail">
        <ServiceDetails service={service} />
      </div>
    </>
  );
}
