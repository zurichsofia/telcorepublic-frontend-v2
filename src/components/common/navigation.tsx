"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { BrandLogoSignal } from "@/components/common/brand-logo-signal";
import { isPastHeroView } from "@/lib/hero-nav-sync";
import { subscribeLenisScroll, isLenisActive } from "@/lib/lenis-scroll";
import { cn } from "@/lib/utils";

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
      { href: "", label: "Expertise" },
      { href: "/about/operation-team", label: "Operation Team" },
      { href: "", label: "Clients" },
    ],
  },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

const dropdownPanelClass =
  "absolute left-0 top-full z-20 -mt-1 min-w-56 py- pl pt-3 text-left invisible opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";

/** Drop `group-focus-within` on the parent so the flyout hides after choosing a sublink. */
function closeNavDropdown() {
  requestAnimationFrame(() => {
    const el = document.activeElement;
    if (el instanceof HTMLElement) el.blur();
  });
}

export type NavigationProps = {
  items?: readonly NavItem[];
  logoHref?: string;
  className?: string;
  newsArticleCount?: number;
  /** `overlay`: light links on hero, dark below. */
  theme?: "default" | "blog" | "overlay";
  /** Matches `AppShell` surface (nav + shell stay in sync). */
  surfaceClassName: string;
  /** `true` when scrolled past `#hero` (overlay theme only). */
  overlayPastHero?: boolean;
};

function navItemActive(
  item: NavItem,
  pathname: string,
): boolean {
  if (item.href === "/news") {
    return pathname === "/news" || pathname.startsWith("/news/");
  }
  if (item.href !== "#" && !item.children?.length) {
    return pathname === item.href;
  }
  return false;
}

/** Telco red: matches brand accent (see `--color-telco-red` in globals). */
function NewsCountBadge({
  count,
  onDark,
  active,
}: {
  count: number;
  onDark: boolean;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-md px-1 text-[11px] font-medium leading-none tabular-nums transition-colors",
        active
          ? "bg-telco-red text-white"
          : cn(
            onDark
              ? "bg-white text-neutral-900"
              : "bg-neutral-900 text-white",
            "group-hover:bg-telco-red group-hover:text-white",
          ),
      )}
      aria-label={`${count} articles`}
    >
      {count}
    </span>
  );
}

function navLinkClass(
  active: boolean,
  theme: "default" | "blog" | "overlay",
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
          : "text-neutral-900 hover:text-telco-red"
        : active
          ? "text-telco-red"
          : "text-white hover:text-telco-red",
    );
  }
  return cn(
    type,
    active
      ? "text-telco-red"
      : "text-neutral-900 hover:text-telco-red",
  );
}

function parentSectionActive(item: NavItem, pathname: string): boolean {
  if (!item.children?.length) return false;
  const segments = item.href.split("/").filter(Boolean);
  const base = segments.length ? `/${segments[0]}` : "";
  if (!base) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}

function NavSubList({
  items,
  pathname,
  theme,
  menuOpen,
  onSublinkPick,
}: {
  items: readonly NavItem[];
  pathname: string;
  theme: "default" | "blog" | "overlay";
  overlayPastHero: boolean;
  menuOpen: boolean;
  onSublinkPick: () => void;
}) {
  const onDarkNav =
    theme === "blog";
  const panelSurface = onDarkNav
    ? "bg-telco-dark shadow-sm ring-1 ring-white/10"
    : "bg-white shadow-sm ring-1 ring-neutral-700/10";
  return (
    <ul
      className={cn(
        "absolute left-0 top-full z-70 mt-0 flex min-w-56 max-w-[min(100vw-2.5rem,20rem)] flex-col gap-y-0 rounded-md px-3 py-2 text-left",
        panelSurface,
        !menuOpen && "hidden",
      )}
      role="list"
      aria-hidden={!menuOpen}
    >
      {items.map((sub) => {
        const hasHref = Boolean(sub.href);
        const subActive = hasHref && pathname === sub.href;
        const className = cn(
          "block py-1.5 text-sm font-light leading-normal transition-colors",
          !hasHref
            ? onDarkNav
              ? "text-white/35"
              : "text-neutral-400"
            : subActive
              ? "text-telco-red"
              : onDarkNav
                ? "text-white hover:text-telco-red"
                : "text-neutral-900 hover:text-telco-red",
        );
        return (
          <li key={sub.label} className="min-w-0">
            {sub.href ? (
              <Link
                href={sub.href}
                className={className}
                onClick={() => {
                  onSublinkPick();
                  closeNavDropdown();
                }}
              >
                {sub.label}
              </Link>
            ) : (
              <span className={className} aria-disabled>
                {sub.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function NavItemWithSubmenu({
  item,
  pathname,
  theme,
  overlayPastHero,
}: {
  item: NavItem;
  pathname: string;
  theme: "default" | "blog" | "overlay";
  overlayPastHero: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setMenuOpen((open) => {
        if (!open) return open;
        const root = wrapRef.current;
        const ae = document.activeElement;
        if (ae instanceof HTMLElement && root?.contains(ae)) {
          ae.blur();
        }
        return false;
      });
    };
    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  }, []);

  const closeIfFocusLeft = (e: React.FocusEvent<HTMLDivElement>) => {
    const related = e.relatedTarget as Node | null;
    if (!related || !e.currentTarget.contains(related)) {
      setMenuOpen(false);
    }
  };

  return (
    <li className="relative isolate">
      <div
        ref={wrapRef}
        className="relative pb-3"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => {
          if (!wrapRef.current?.contains(document.activeElement)) {
            setMenuOpen(false);
          }
        }}
        onFocusCapture={() => setMenuOpen(true)}
        onBlur={closeIfFocusLeft}
      >
        <Link
          href={item.href}
          className={navLinkClass(
            parentSectionActive(item, pathname),
            theme,
            overlayPastHero,
          )}
        >
          {item.label}
        </Link>
        <NavSubList
          items={item.children!}
          pathname={pathname}
          theme={theme}
          overlayPastHero={overlayPastHero}
          menuOpen={menuOpen}
          onSublinkPick={() => setMenuOpen(false)}
        />
      </div>
    </li>
  );
}

/** Hero ↔ post-hero background fade (overlay routes). */
export const shellSurfaceTransitionClass =
  "transition-colors duration-200 ease-out motion-reduce:transition-none";

export function shellSurfaceClassName(
  theme: "default" | "blog" | "overlay",
  overlayPastHero: boolean,
): string {
  if (theme === "blog") return "bg-telco-dark";
  if (theme === "overlay") {
    return overlayPastHero ? "bg-white" : "bg-white/0"; // `/0` fades; `transparent` does not
  }
  return "bg-white";
}

function resetViewportScroll() {
  (document.scrollingElement ?? document.documentElement).scrollTo(0, 0);
  window.scrollTo(0, 0);
}

export function useOverlayPastHero(
  theme: "default" | "blog" | "overlay",
  pathname: string,
) {
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

    resetViewportScroll(); // avoid white nav flash from stale scroll on route change
    sync();
    const postResetRaf = requestAnimationFrame(sync);

    const offLenis = subscribeLenisScroll(sync);
    let rafId = 0;
    const onNativeScroll = () => {
      if (isLenisActive()) return;
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        sync();
      });
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(postResetRaf);
      offLenis();
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", sync);
      if (rafId !== 0) cancelAnimationFrame(rafId);
    };
  }, [theme, pathname]);

  return pastHero;
}

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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 isolate w-full shrink-0 px-5 py-6 sm:px-8",
        theme === "overlay" && shellSurfaceTransitionClass,
        surfaceClassName,
        className,
      )}
    >
      <div className="mx-auto flex items-center justify-between gap-8">
        <BrandLogoSignal
          href={logoHref}
          variant={logoVariant}
          size="compact"
        />

        <nav aria-label="Primary" className="pt-1">
          <ul className="flex flex-wrap items-start justify-start gap-x-24 gap-y-2 pr-20">
            {items.map((item) => {
              if (item.children?.length) {
                return (
                  <NavItemWithSubmenu
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    theme={theme}
                    overlayPastHero={overlayPastHero}
                  />
                );
              }

              const isActive = navItemActive(item, pathname);
              const isNews = item.href === "/news";
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      navLinkClass(isActive, theme, overlayPastHero),
                      isNews && "group inline-flex items-center gap-1.5",
                      isNews && isActive && "font-medium",
                    )}
                  >
                    {item.label}
                    {isNews ? (
                      <NewsCountBadge
                        count={newsArticleCount}
                        onDark={onDark}
                        active={isActive}
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
