"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import {
  mobileMenuSurfaceClass,
  mobileNavLinkClass,
  mobileSubmenuLinkClass,
  menuCloseIconClass,
  menuIconClass,
  parentSectionActive,
  renderNavLeafItem,
  type NavItem,
  type NavLinksContext,
} from "@/components/common/navigation-shared";
import { cn } from "@/lib/utils";

function MenuIcon({ open }: { open: boolean; }) {
  if (open) {
    return (
      <svg
        aria-hidden
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function MobileNavItemWithSubmenu({
  item,
  pathname,
  theme,
  overlayPastHero,
  onDark,
  onNavigate,
}: NavLinksContext & { item: NavItem; }) {
  const [expanded, setExpanded] = useState(false);
  const onDarkNav = theme === "blog" || (theme === "overlay" && !overlayPastHero);
  const sectionActive = parentSectionActive(item, pathname);

  return (
    <li className="border-b border-current/10 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={item.href}
          className={mobileNavLinkClass(sectionActive, theme, overlayPastHero)}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
        <button
          type="button"
          className={cn(
            "inline-flex shrink-0 items-center justify-center p-2 transition-transform",
            onDarkNav
              ? "text-white hover:text-telco-red"
              : "text-telco-dark hover:text-telco-red",
            expanded && "rotate-180",
          )}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label} submenu`}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <svg
            aria-hidden
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      {expanded ? (
        <ul role="list" className="pb-2">
          {item.children!.map((sub) => {
            const hasHref = Boolean(sub.href);
            const subActive = hasHref && pathname === sub.href;
            const className = mobileSubmenuLinkClass(hasHref, subActive, onDarkNav);

            return (
              <li key={sub.label}>
                {sub.href ? (
                  <Link href={sub.href} className={className} onClick={onNavigate}>
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
      ) : null}
    </li>
  );
}

export function NavigationMobile({
  items,
  pathname,
  theme,
  overlayPastHero,
  newsArticleCount,
  onDark,
}: NavLinksContext) {
  const menuId = useId();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const panelSurface = mobileMenuSurfaceClass(theme, overlayPastHero);
  const onDarkPanel =
    theme === "blog" || (theme === "overlay" && !overlayPastHero);

  return (
    <>
      <div className="flex size-10 shrink-0 items-center justify-center lg:hidden">
        <button
          type="button"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-sm transition-colors",
            menuIconClass(),
            open && "pointer-events-none invisible",
          )}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="Open menu"
          aria-hidden={open}
          tabIndex={open ? -1 : 0}
          onClick={() => setOpen(true)}
        >
          <MenuIcon open={false} />
        </button>
      </div>

      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "fixed inset-0 z-60 flex flex-col lg:hidden",
          panelSurface,
          "transition-[opacity,visibility] duration-200 ease-out motion-reduce:transition-none",
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        )}
      >
        <div className="flex shrink-0 items-center justify-end px-5 py-6 sm:px-8">
          <button
            type="button"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-sm transition-colors",
              menuCloseIconClass(onDarkPanel),
            )}
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <MenuIcon open />
          </button>
        </div>

        <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto">
          <ul
            role="list"
            className={cn(
              "px-5 pb-10 sm:px-8",
              onDarkPanel ? "text-white" : "text-telco-dark",
            )}
          >
            {items.map((item) => {
              if (item.children?.length) {
                return (
                  <MobileNavItemWithSubmenu
                    key={item.label}
                    item={item}
                    items={items}
                    pathname={pathname}
                    theme={theme}
                    overlayPastHero={overlayPastHero}
                    newsArticleCount={newsArticleCount}
                    onDark={onDark}
                    onNavigate={closeMenu}
                  />
                );
              }

              return (
                <li
                  key={item.label}
                  className="border-b border-current/10 last:border-b-0"
                >
                  {renderNavLeafItem({
                    item,
                    items,
                    pathname,
                    theme,
                    overlayPastHero,
                    newsArticleCount,
                    onDark,
                    onNavigate: closeMenu,
                    linkClassName: mobileNavLinkClass,
                  })}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
