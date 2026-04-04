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
        className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-tech-strong)] bg-[var(--surface-panel)] px-1.5 py-1.5 pl-6 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--color-accent)] shadow-lg shadow-black/30 backdrop-blur-[10px] transition hover:border-[var(--border-tech-hover)] hover:bg-[var(--surface-panel-hover)] sm:pl-7"
      >
        <span>{children}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-tech)] bg-[var(--surface-glass)] text-[var(--color-accent)] transition group-hover:border-[var(--border-tech-hover)] sm:h-10 sm:w-10">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border-tech)] bg-[var(--surface-glass)] px-7 py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-accent)] backdrop-blur-xl transition hover:border-[var(--border-tech-hover)] hover:bg-[var(--surface-panel)] sm:py-3.5"
    >
      {children}
    </Link>
  );
}
