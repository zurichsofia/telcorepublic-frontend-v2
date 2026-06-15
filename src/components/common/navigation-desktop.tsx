"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

import {
  dismissNavDropdown,
  dropdownPanelAlignEnd,
  dropdownPanelAlignStart,
  dropdownPanelBase,
  dropdownPanelOpenClass,
  dropdownPanelSurface,
  desktopNavLinkClass,
  parentSectionActive,
  renderNavLeafItem,
  type NavItem,
  type NavLinksContext,
  type NavigationTheme,
} from "@/components/common/navigation-shared";
import { cn } from "@/lib/utils";

/** Shared shell height so labels align; bottom padding bridges submenu hover. */
const desktopNavItemShellClass = "relative pb-3";

function NavItemWithSubmenu({
  item,
  pathname,
  theme,
  overlayPastHero,
  menuAlign = "start",
}: {
  item: NavItem;
  pathname: string;
  theme: NavigationTheme;
  overlayPastHero: boolean;
  menuAlign?: "start" | "end";
}) {
  const [dismissed, setDismissed] = useState(false);
  const onDarkNav = theme === "blog";
  const panelSurface = dropdownPanelSurface(onDarkNav);

  const dismiss = (e: MouseEvent<HTMLElement>) => {
    setDismissed(true);
    dismissNavDropdown(e);
  };

  return (
    <li className="relative isolate">
      <div
        className={cn(desktopNavItemShellClass, "group")}
        onMouseLeave={() => setDismissed(false)}
      >
        <Link
          href={item.href}
          className={desktopNavLinkClass(
            parentSectionActive(item, pathname),
            theme,
            overlayPastHero,
          )}
          onClick={dismiss}
        >
          {item.label}
        </Link>
        <ul
          role="list"
          className={cn(
            dropdownPanelBase,
            menuAlign === "end" ? dropdownPanelAlignEnd : dropdownPanelAlignStart,
            panelSurface,
            dismissed ? "hidden" : dropdownPanelOpenClass,
          )}
        >
          {item.children!.map((sub) => {
            const hasHref = Boolean(sub.href);
            const subActive = hasHref && pathname === sub.href;
            const className = cn(
              "block py-1.5 text-lg font-light leading-normal transition-colors",
              !hasHref
                ? onDarkNav
                  ? "text-white/35"
                  : "text-neutral-400"
                : subActive
                  ? "text-telco-red"
                  : onDarkNav
                    ? "text-white hover:text-telco-red"
                    : "text-telco-dark hover:text-telco-red",
            );
            return (
              <li key={sub.label} className="min-w-0">
                {sub.href ? (
                  <Link href={sub.href} className={className} onClick={dismiss}>
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
      </div>
    </li>
  );
}

export function NavigationDesktop({
  items,
  pathname,
  theme,
  overlayPastHero,
  newsArticleCount,
  onDark,
}: NavLinksContext) {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-start gap-x-24">
        {items.map((item, index) => {
          if (item.children?.length) {
            return (
              <NavItemWithSubmenu
                key={item.label}
                item={item}
                pathname={pathname}
                theme={theme}
                overlayPastHero={overlayPastHero}
                menuAlign={index === items.length - 1 ? "end" : "start"}
              />
            );
          }

          return (
            <li key={item.label}>
              <div className={desktopNavItemShellClass}>
                {renderNavLeafItem({
                  item,
                  items,
                  pathname,
                  theme,
                  overlayPastHero,
                  newsArticleCount,
                  onDark,
                  linkClassName: desktopNavLinkClass,
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
