"use client";

import { usePathname } from "next/navigation";

import { BrandLogoSignal } from "@/components/common/brand-logo-signal";
import { NavigationDesktop } from "@/components/common/navigation-desktop";
import { NavigationMobile } from "@/components/common/navigation-mobile";
import {
  defaultNavItems,
  shellSurfaceTransitionClass,
  shellSurfaceClassName,
  useOverlayPastHero,
  type NavItem,
  type NavigationTheme,
} from "@/components/common/navigation-shared";
import { cn } from "@/lib/utils";

export type { NavItem } from "@/components/common/navigation-shared";
export {
  defaultNavItems,
  shellSurfaceTransitionClass,
  shellSurfaceClassName,
  useOverlayPastHero,
} from "@/components/common/navigation-shared";

export type NavigationProps = {
  items?: readonly NavItem[];
  logoHref?: string;
  className?: string;
  newsArticleCount?: number;
  /** `overlay`: light links on hero, dark below. */
  theme?: NavigationTheme;
  /** Matches `AppShell` surface (nav + shell stay in sync). */
  surfaceClassName: string;
  /** `true` when scrolled past `#hero` (overlay theme only). */
  overlayPastHero?: boolean;
};

export function Navigation({
  items = defaultNavItems,
  logoHref = "/",
  className,
  newsArticleCount = 0,
  theme = "default",
  surfaceClassName,
  overlayPastHero = false,
}: NavigationProps) {
  const pathname = usePathname() ?? "";
  const onDark = theme === "blog";
  const logoVariant =
    onDark ? "onDark" : theme === "overlay" && !overlayPastHero ? "brand" : "onLight";

  const navContext = {
    items,
    pathname,
    theme,
    overlayPastHero,
    newsArticleCount,
    onDark,
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 isolate w-full shrink-0 overflow-x-clip px-5 py-6 sm:px-8",
        theme === "overlay" && shellSurfaceTransitionClass,
        surfaceClassName,
        className,
      )}
    >
      <div className="mx-auto flex items-center justify-between gap-4">
        <BrandLogoSignal
          href={logoHref}
          variant={logoVariant}
          size="compact"
          className="max-lg:[&_img]:h-5! lg:[&_img]:h-8!"
        />

        <NavigationDesktop {...navContext} />
        <NavigationMobile {...navContext} />
      </div>
    </header>
  );
}
