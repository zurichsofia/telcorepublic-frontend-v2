"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

/**
 * Keeps the video hero and detail panel on the active service when the URL
 * updates via `history.replaceState` or browser history (no App Router navigation
 * — avoids a full-tree flash).
 */
export function ServiceWrapper({ initialSlug }: ServiceWrapperProps) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const lastServerSlugRef = useRef(initialSlug);

  useEffect(() => {
    if (lastServerSlugRef.current === initialSlug) return;
    lastServerSlugRef.current = initialSlug;
    setActiveSlug(initialSlug);
  }, [initialSlug]);

  useEffect(() => {
    const onPopState = () => {
      const fromUrl = slugFromPathname(window.location.pathname);
      if (fromUrl && getServiceBySlug(fromUrl)) {
        setActiveSlug(fromUrl);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const onActiveServiceChange = useCallback(
    (slug: string) => {
      if (slug === activeSlug) return;
      setActiveSlug(slug);
    },
    [activeSlug],
  );

  const service = getServiceBySlug(activeSlug) ?? getServiceBySlug(initialSlug);

  if (!service) return null;

  return (
    <>
      <ServiceVideoHeroV2
        initialSlug={activeSlug}
        onActiveServiceChange={onActiveServiceChange}
      />
      <div id="service-detail" className="relative isolate w-full">
        <ServiceDetails service={service} />
      </div>
    </>
  );
}

