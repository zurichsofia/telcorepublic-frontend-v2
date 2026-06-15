"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/common/footer";
import {
  Navigation,
  shellSurfaceClassName,
  shellSurfaceTransitionClass,
  useOverlayPastHero,
} from "@/components/common/navigation";
import {
  LenisScrollToTopOnNavigate,
  SmoothScrollProvider,
} from "@/components/common/smooth-scroll-provider";
import { HeroSceneLoader } from "@/components/landing/snow-mountain/hero/hero-scene-loader";
import { useSceneReady } from "@/hooks/use-scene-ready";
import { cn } from "@/lib/utils";

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
  const isHowToWorkWithUs = pathname === "/contact/how-to-work-with-us";
  const isStudio = pathname.startsWith("/studio");
  const immersiveHero = isServiceDetail || isHome;
  const darkShell = isNews || isContact;
  const theme = darkShell ? "blog" : immersiveHero ? "overlay" : "default";
  const overlayPastHero = useOverlayPastHero(theme, pathname);
  const surfaceClassName = shellSurfaceClassName(theme, overlayPastHero);
  const sceneReady = useSceneReady();

  // While the home boot loader covers the screen the browser chrome should stay
  // telco-dark; once it resolves the page underneath is white.
  //
  // iOS 26 Safari ignores theme-color and samples the background of an opaque
  // fixed element near the viewport edge — and only re-samples on a structural
  // change, not when JS recolors an element or the body. So the tint strip
  // below owns the bottom toolbar and is remounted (`key`) on every variant
  // change to force a fresh sample. theme-color is kept synced for Android.
  const [heroLoaderActive, setHeroLoaderActive] = useState(isHome);
  const toolbarVariant: "light" | "dark" =
    (isHome && heroLoaderActive) || darkShell ? "dark" : "light";

  useEffect(() => {
    const color = toolbarVariant === "dark" ? "#150f0f" : "#ffffff";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [toolbarVariant]);

  // Browsers can restore/apply scroll after a client navigation, which (with a long view
  // e.g. /services or /services/slug) leaves a high scroll offset that clamps to the
  // bottom of the next, shorter page. `manual` lets us own scroll position; Lenis/native
  // reset runs in LenisScrollToTopOnNavigate.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <SmoothScrollProvider enabled={!isStudio && !isContact}>
      {isStudio ? null : <LenisScrollToTopOnNavigate pathname={pathname} />}
      {isStudio ? null : (
        <div
          key={toolbarVariant}
          aria-hidden
          className={cn(
            "safari-toolbar-tint pointer-events-none lg:hidden",
            toolbarVariant === "dark" ? "bg-telco-dark" : "bg-white",
          )}
        />
      )}
      {isHome ? (
        <HeroSceneLoader ready={sceneReady} onActiveChange={setHeroLoaderActive} />
      ) : null}
      {isHome && !sceneReady ? (
        <div className="fixed inset-0 z-[99] bg-telco-dark" aria-hidden />
      ) : null}
      {isStudio ? (
        children
      ) : (
        <div
          className={cn(
            "relative z-10 flex min-h-screen flex-col",
            immersiveHero && shellSurfaceTransitionClass,
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
          <div
            className={cn(
              "relative z-0 flex min-h-0 min-w-0 flex-1 flex-col",
              isHowToWorkWithUs && "overflow-x-clip",
            )}
          >
            {children}
          </div>
          <Footer className="mt-auto" />
        </div>
      )}
    </SmoothScrollProvider>
  );
}
