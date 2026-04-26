"use client";

import { useEffect, useLayoutEffect } from "react";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/common/footer";
import { Navigation } from "@/components/common/navigation";
import { cn } from "@/lib/utils";

function scrollViewToTop() {
  (document.scrollingElement ?? document.documentElement).scrollTo(0, 0);
  window.scrollTo(0, 0);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isServiceDetail = /^\/services\/[^/]+$/.test(pathname);
  const isNews = pathname === "/news" || pathname.startsWith("/news/");
  const isContact = pathname === "/contact";
  const darkShell = isNews || isContact;

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

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-screen flex-col",
        darkShell ? "bg-telco-dark" : isServiceDetail ? "bg-transparent" : "bg-white",
      )}
    >
      <Navigation
        className={
          isServiceDetail ? "fixed top-0 right-0 left-0 z-50 w-full" : undefined
        }
        theme={darkShell ? "blog" : isServiceDetail ? "overlay" : "default"}
      />
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">{children}</div>
      <Footer className="mt-auto" />
    </div>
  );
}
