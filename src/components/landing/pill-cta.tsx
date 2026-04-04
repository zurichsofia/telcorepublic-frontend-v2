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
        className="group inline-flex items-center gap-2 rounded-full bg-white px-1.5 py-1.5 pl-6 text-sm font-semibold text-black shadow-lg shadow-black/20 transition hover:bg-white/95 sm:pl-7 sm:text-[0.9375rem]"
      >
        <span>{children}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition group-hover:bg-neutral-900 sm:h-10 sm:w-10">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:bg-white/15 sm:py-3.5 sm:text-[0.9375rem]"
    >
      {children}
    </Link>
  );
}
