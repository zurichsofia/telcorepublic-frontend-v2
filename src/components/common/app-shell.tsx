"use client";

import { useEffect, useLayoutEffect } from "react";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/common/footer";
import {
  Navigation,
  shellSurfaceClassName,
  useOverlayPastHero,
} from "@/components/common/navigation";
import { SmoothScrollProvider } from "@/components/common/smooth-scroll-provider";
import { cn } from "@/lib/utils";

function scrollViewToTop() {
  (document.scrollingElement ?? document.documentElement).scrollTo(0, 0);
  window.scrollTo(0, 0);
}

export function AppShell({
  children,
  newsArticleCount,
}: {
  children: React.ReactNode;
  newsArticleCount: number;
}) {
  const pathname = usePathname() ?? "";
  const isServiceDetail = /^\/services\/[^/]+$/.test(pathname);
  const isHome = pathname === "/" || pathname === "";
  const isNews = pathname === "/news" || pathname.startsWith("/news/");
  const isContact = pathname === "/contact";
  const isStudio = pathname.startsWith("/studio");
  const immersiveHero = isServiceDetail || isHome;
  const darkShell = isNews || isContact;
  const theme = darkShell ? "blog" : immersiveHero ? "overlay" : "default";
  const overlayPastHero = useOverlayPastHero(theme);
  const surfaceClassName = shellSurfaceClassName(theme, overlayPastHero);

  // Browsers can restore/apply scroll after a client navigation, which (with a long view
  // e.g. /services or /services/slug) leaves a high scroll offset that clamps to the
  // bottom of the next, shorter page. `manual` lets us own scroll position; we also reset
  // again on the next frame so it wins over App Router’s pass.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    scrollViewToTop();
  }, [pathname]);

  useEffect(() => {
    scrollViewToTop();
    const t = setTimeout(() => {
      scrollViewToTop();
    }, 0);
    return () => {
      clearTimeout(t);
    };
  }, [pathname]);

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider enabled={isServiceDetail}>
      <div
        className={cn(
          "relative z-10 flex min-h-screen flex-col",
          surfaceClassName,
        )}
      >
        <Navigation
          newsArticleCount={newsArticleCount}
          className={
            immersiveHero ? "fixed top-0 right-0 left-0 z-50 w-full" : undefined
          }
          theme={theme}
          surfaceClassName={surfaceClassName}
          overlayPastHero={overlayPastHero}
        />
        <div className="relative z-0 flex min-h-0 flex-1 flex-col">{children}</div>
        <Footer className="mt-auto" />
      </div>
    </SmoothScrollProvider>
  );
}
