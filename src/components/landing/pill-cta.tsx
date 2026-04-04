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
        className="group inline-flex items-center gap-2 rounded-full border border-[rgba(140,180,220,0.35)] bg-[rgba(15,25,50,0.5)] px-1.5 py-1.5 pl-6 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--color-accent)] shadow-lg shadow-black/30 backdrop-blur-[10px] transition hover:border-[rgba(140,180,220,0.55)] hover:bg-[rgba(30,50,90,0.55)] sm:pl-7"
      >
        <span>{children}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(140,180,220,0.25)] bg-[rgba(10,18,30,0.6)] text-[var(--color-accent)] transition group-hover:border-[rgba(140,180,220,0.45)] sm:h-10 sm:w-10">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[rgba(140,180,220,0.25)] bg-[rgba(10,18,30,0.35)] px-7 py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-accent)] backdrop-blur-xl transition hover:border-[rgba(140,180,220,0.45)] hover:bg-[rgba(30,50,80,0.45)] sm:py-3.5"
    >
      {children}
    </Link>
  );
}
