"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";

import { cn } from "@/lib/utils";
import { isPastHeroView } from "@/lib/hero-nav-sync";
import { subscribeLenisScroll, isLenisActive } from "@/lib/lenis-scroll";

export type NavItem = {
  href: string;
  label: string;
  children?: readonly NavItem[];
};

export const defaultNavItems: readonly NavItem[] = [
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/disrupter-quintants", label: "Disrupter Quintants" },
      { href: "/services/subscription", label: "Subscription" },
      { href: "/services/competitive-positioning", label: "Competitive Positioning" },
      { href: "/services/go-to-market", label: "Go-To-Market" },
      { href: "/services/market-assessment", label: "Market Assessment" },
      { href: "/services/custom-research", label: "Custom Research" },
    ],
  },
  {
    href: "/about/operation-team",
    label: "About",
    children: [
      { href: "/about/expertise", label: "Expertise" },
      { href: "/about/who-we-serve", label: "Who We Serve" },
      { href: "/about/operation-team", label: "Operation Team" },
      { href: "/about/clients", label: "Clients" },
    ],
  },
  { href: "/news", label: "News" },
  {
    href: "/contact",
    label: "Contact",
    children: [{ href: "/contact/how-to-work-with-us", label: "How To Work With Us" }],
  },
];

export type NavigationTheme = "default" | "blog" | "overlay";

export type NavLinksContext = {
  items: readonly NavItem[];
  pathname: string;
  theme: NavigationTheme;
  overlayPastHero: boolean;
  newsArticleCount: number;
  onDark: boolean;
  onNavigate?: () => void;
};

export const dropdownPanelBase =
  "absolute top-full z-70 mt-0 flex min-w-56 max-w-xl flex-col gap-y-0 rounded-md px-3 py-2 text-left";

export const dropdownPanelAlignStart = "left-0 right-auto";
export const dropdownPanelAlignEnd = "right-0 left-auto";

export const dropdownPanelOpenClass =
  "invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";

export function dismissNavDropdown(e: MouseEvent<HTMLElement>) {
  e.currentTarget.blur();
}

export function navItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/news") {
    return pathname === "/news" || pathname.startsWith("/news/");
  }
  if (item.href !== "#" && !item.children?.length) {
    return pathname === item.href;
  }
  return false;
}

/** Telco red: matches brand accent (see `--color-telco-red` in globals). */
export function NewsCountBadge({
  count,
  onDark,
  active,
  className,
}: {
  count: number;
  onDark: boolean;
  active: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-md px-1 text-[11px] font-medium leading-none tabular-nums transition-colors",
        className,
        active
          ? "bg-telco-red text-white"
          : cn(
            onDark
              ? "bg-white text-telco-dark"
              : "bg-telco-dark text-white",
            "group-hover:bg-telco-red group-hover:text-white",
          ),
      )}
      aria-label={`${count} articles`}
    >
      {count}
    </span>
  );
}

export function navLinkClass(
  active: boolean,
  theme: NavigationTheme,
  overlayPastHero: boolean,
) {
  const type = cn(
    "text-sm transition-colors",
    active ? "font-normal" : "font-light",
  );

  if (theme === "blog") {
    return cn(
      type,
      active ? "text-telco-red" : "text-white hover:text-telco-red",
    );
  }
  if (theme === "overlay") {
    return cn(
      type,
      overlayPastHero
        ? active
          ? "text-telco-red"
          : "text-telco-dark hover:text-telco-red"
        : active
          ? "text-telco-red"
          : "text-white hover:text-telco-red",
    );
  }
  return cn(
    type,
    active
      ? "text-telco-red"
      : "text-telco-dark hover:text-telco-red",
  );
}

export function desktopNavLinkClass(
  active: boolean,
  theme: NavigationTheme,
  overlayPastHero: boolean,
) {
  return cn(navLinkClass(active, theme, overlayPastHero), "text-lg");
}

export function mobileNavLinkClass(
  active: boolean,
  theme: NavigationTheme,
  overlayPastHero: boolean,
) {
  return cn(
    navLinkClass(active, theme, overlayPastHero),
    "block py-4 text-lg",
  );
}

export function parentSectionActive(item: NavItem, pathname: string): boolean {
  if (!item.children?.length) return false;
  const segments = item.href.split("/").filter(Boolean);
  const base = segments.length ? `/${segments[0]}` : "";
  if (!base) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function dropdownPanelSurface(onDarkNav: boolean) {
  return onDarkNav
    ? "bg-telco-dark shadow-sm ring-1 ring-white/10"
    : "bg-white shadow-sm ring-1 ring-neutral-700/10";
}

export function mobileMenuSurfaceClass(
  theme: NavigationTheme,
  overlayPastHero: boolean,
) {
  if (theme === "blog") return "bg-telco-dark";
  if (theme === "overlay") {
    return overlayPastHero ? "bg-white" : "bg-telco-dark";
  }
  return "bg-white";
}

export function mobileMenuBorderClass(
  theme: NavigationTheme,
  overlayPastHero: boolean,
) {
  if (theme === "blog") return "border-white/10";
  if (theme === "overlay") {
    return overlayPastHero ? "border-neutral-700/10" : "border-white/10";
  }
  return "border-neutral-700/10";
}

export function mobileSubmenuLinkClass(
  hasHref: boolean,
  subActive: boolean,
  onDarkNav: boolean,
) {
  return cn(
    "block py-2 pl-4 text-lg font-light leading-normal transition-colors",
    !hasHref
      ? onDarkNav
        ? "text-white/35"
        : "text-neutral-400"
      : subActive
        ? "text-telco-red"
        : onDarkNav
          ? "text-white/90 hover:text-telco-red"
          : "text-telco-dark hover:text-telco-red",
  );
}

export function menuIconClass(onDarkLogo: boolean) {
  return onDarkLogo
    ? "text-white hover:text-telco-red"
    : "text-telco-dark hover:text-telco-red";
}

export function menuCloseIconClass(onDarkPanel: boolean) {
  return onDarkPanel
    ? "text-white hover:text-telco-red"
    : "text-telco-dark hover:text-telco-red";
}

export function renderNavLeafItem({
  item,
  pathname,
  theme,
  overlayPastHero,
  newsArticleCount,
  onDark,
  onNavigate,
  linkClassName = navLinkClass,
}: NavLinksContext & {
  item: NavItem;
  linkClassName?: typeof navLinkClass;
}) {
  const isActive = navItemActive(item, pathname);
  const isNews = item.href === "/news";

  return (
    <Link
      href={item.href}
      className={cn(
        linkClassName(isActive, theme, overlayPastHero),
        isNews && "group",
        isNews && isActive && "font-medium",
      )}
      onClick={onNavigate}
    >
      {item.label}
      {isNews ? (
        <>
          {" "}
          <NewsCountBadge
            count={newsArticleCount}
            onDark={onDark}
            active={isActive}
            className="ml-1.5 align-middle"
          />
        </>
      ) : null}
    </Link>
  );
}

/** Hero ↔ post-hero background fade (overlay routes). */
export const shellSurfaceTransitionClass =
  "transition-colors duration-200 ease-out motion-reduce:transition-none";

export function shellSurfaceClassName(
  theme: NavigationTheme,
  overlayPastHero: boolean,
): string {
  if (theme === "blog") return "bg-telco-dark";
  if (theme === "overlay") {
    return overlayPastHero ? "bg-white" : "bg-white/0"; // `/0` fades; `transparent` does not
  }
  return "bg-white";
}

export function useOverlayPastHero(theme: NavigationTheme, pathname: string) {
  const [pastHero, setPastHero] = useState(false);
  const pastRef = useRef(false);

  useLayoutEffect(() => {
    if (theme !== "overlay") {
      pastRef.current = false;
      setPastHero(false);
      return;
    }

    const sync = () => {
      const next = isPastHeroView(pastRef.current);
      pastRef.current = next;
      setPastHero((prev) => (prev === next ? prev : next));
    };

    sync();

    // subscribeLenisScroll already batches to one rAF — avoid a second frame of lag.
    const offLenis = subscribeLenisScroll(sync);
    const onNativeScroll = () => {
      if (isLenisActive()) return;
      sync();
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      offLenis();
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", sync);
    };
  }, [theme, pathname]);

  return pastHero;
}
