"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogoSignal } from "@/components/brand-logo-signal";
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
      { href: "/services/competitive-positioning", label: "Competitive Positioning" },
      { href: "/services/go-to-market", label: "Go-To-Market" },
      { href: "/services/market-assessment", label: "Market Assessment" },
      { href: "/services/custom-research", label: "Custom Research" },
      { href: "/services/subscription", label: "Subscription" },
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

export type NavigationProps = {
  items?: readonly NavItem[];
  logoHref?: string;
  className?: string;
  /** Black header with light nav links (blog index, etc.). */
  theme?: "default" | "blog";
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
function navLinkClass(
  active: boolean,
  theme: "default" | "blog",
) {
  if (theme === "blog") {
    return cn(
      "text-sm font-light transition",
      active ? "text-red-600" : "text-white hover:text-red-600",
    );
  }
  return cn(
    "text-sm font-light transition",
    active
      ? "text-red-600"
      : "text-neutral-900 hover:text-red-600",
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
}: {
  items: readonly NavItem[];
  pathname: string;
  theme: "default" | "blog";
}) {
  return (
    <ul className={dropdownPanelClass} role="list">
      {items.map((sub) => {
        const subActive = sub.href !== "#" && pathname === sub.href;
        return (
          <li key={sub.label}>
            <Link
              href={sub.href}
              className={cn(
                "block text-sm font-light transition",
                subActive
                  ? "text-red-600"
                  : theme === "blog"
                    ? "text-white hover:text-red-600"
                    : "text-neutral-900 hover:text-red-600",
              )}
            >
              {sub.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Navigation({
  items = defaultNavItems,
  logoHref = "/",
  className,
  theme = "default",
}: NavigationProps) {
  const pathname = usePathname() ?? "";
  const blog = theme === "blog";

  return (
    <header
      className={cn(
        "px-5 py-6 sm:px-8 h-60",
        blog ? "bg-telco-dark" : "bg-white",
        className,
      )}
    >
      <div className="mx-auto flex items-end justify-between gap-8">
        <BrandLogoSignal
          href={logoHref}
          variant={blog ? "onDark" : "onLight"}
          size="compact"
        />

        <nav aria-label="Primary" className="pt-1">
          <ul className="flex flex-wrap items-start justify-start gap-x-24 gap-y-2 pr-20">
            {items.map((item) => {
              if (item.children?.length) {
                return (
                  <li key={item.label} className="relative">
                    <div className="group">
                      <Link
                        href={item.href}
                        className={navLinkClass(
                          parentSectionActive(item, pathname),
                          theme,
                        )}
                      >
                        {item.label}
                      </Link>
                      <NavSubList
                        items={item.children}
                        pathname={pathname}
                        theme={theme}
                      />
                    </div>
                  </li>
                );
              }

              const isActive = navItemActive(item, pathname);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={navLinkClass(isActive, theme)}
                  >
                    {item.label}
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
