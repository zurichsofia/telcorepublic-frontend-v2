"use client";

import Link from "next/link";

import { BrandLogoSignal } from "@/components/brand-logo-signal";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#home", label: "Home" },
  { href: "#blog", label: "Blog" },
  { href: "#aboutus", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;

export type HeroNavTone = "onDark" | "onLight";

export function HeroNav({ tone = "onDark" }: { tone?: HeroNavTone }) {
  const onLight = tone === "onLight";

  return (
    <header className="absolute inset-x-0 top-0 z-30 px-5 pt-5 sm:px-8 sm:pt-7">
      <div className="relative mx-auto flex max-w-[min(100%,1400px)] items-center justify-between gap-6">
        <Link href="#home" className="inline-flex w-fit shrink-0">
          <BrandLogoSignal priority tone={tone} />
        </Link>
        <nav aria-label="Primary">
          <ul
            className={cn(
              "flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm",
              onLight ? "text-(--color-heading)" : "text-white",
            )}
          >
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={onLight ? "hover:text-(--color-telco-red)" : "hover:opacity-80"}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
