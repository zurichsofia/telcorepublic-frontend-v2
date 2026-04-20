"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ServiceVideoHero } from "@/components/landing/service-video-hero/service-video-hero";
import { ServiceEditorialScroll } from "./service-editorial-scroll/service-editorial-scroll";
import { getServiceBySlug } from "@/data/services";
import { useServiceViewportScrollSnap } from "@/hooks/use-service-viewport-scroll-snap";

function slugFromPathname(pathname: string): string | undefined {
  const m = pathname.match(/^\/services\/([^/]+)/);
  if (!m?.[1]) return undefined;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

export type ServiceSlugShellProps = {
  initialSlug: string;
};

/**
 * Keeps the video hero and editorial scroll on the active service when the URL
 * updates via `history.replaceState` or browser history (no App Router navigation
 * — avoids a full-tree flash). Root `scroll-behavior` is `auto` in `globals.css`
 * so wheel/trackpad stays native; service pages add snap via `useServiceViewportScrollSnap`.
 */
export function ServiceSlugShell({ initialSlug }: ServiceSlugShellProps) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const lastServerSlugRef = useRef(initialSlug);

  useServiceViewportScrollSnap();

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

  const onActiveServiceChange = useCallback((slug: string) => {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
  }, [activeSlug]);

  const service =
    getServiceBySlug(activeSlug) ?? getServiceBySlug(initialSlug);

  if (!service) return null;

  return (
    <>
      <ServiceVideoHero
        initialSlug={activeSlug}
        onActiveServiceChange={onActiveServiceChange}
      />
      <div id="service-detail" className="relative isolate w-full">
        <ServiceEditorialScroll
          blocks={service.content}
          storyKey={service.slug}
        />
      </div>
    </>
  );
}
