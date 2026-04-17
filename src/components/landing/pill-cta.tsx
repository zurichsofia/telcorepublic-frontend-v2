import Link from "next/link";
import type { ReactNode } from "react";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PillCtaProps = {
  href: string;
  children: ReactNode;
  variant: "solid" | "glass";
};

export function PillCta({ href, children, variant }: PillCtaProps) {
  if (variant === "solid") {
    return (
      <Link
        href={href}
        className="group inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-clouds)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-white)_90%,transparent)] px-1.5 py-1.5 pl-6 text-sm font-medium uppercase tracking-wide text-[var(--color-telco-red)] shadow-lg shadow-black/30 backdrop-blur-[10px] transition hover:border-[color-mix(in_srgb,var(--color-telco-red)_55%,transparent)] hover:bg-[var(--color-white)] sm:pl-7"
      >
        <span>{children}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-clouds)_50%,transparent)] bg-[color-mix(in_srgb,var(--color-white)_75%,transparent)] text-[var(--color-telco-red)] transition group-hover:border-[color-mix(in_srgb,var(--color-telco-red)_55%,transparent)] sm:h-10 sm:w-10">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-clouds)_50%,transparent)] bg-[color-mix(in_srgb,var(--color-white)_75%,transparent)] px-7 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-telco-red)] backdrop-blur-xl transition hover:border-[color-mix(in_srgb,var(--color-telco-red)_55%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-white)_90%,transparent)] sm:py-3.5"
    >
      {children}
    </Link>
  );
}
