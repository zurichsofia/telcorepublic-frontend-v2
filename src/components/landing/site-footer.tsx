import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-[2] border-t border-[rgba(140,180,120,0.08)] bg-[#000000] px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-[1.375rem] tracking-[0.02em] text-[rgba(240,250,220,0.7)]">
            Telcorepublic
          </p>
          <p className="mt-2 max-w-xs text-xs font-light leading-[1.7] text-[rgba(215,230,190,0.4)]">
            Independent research for the people who design, regulate, and invest in
            connectivity.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm" aria-label="Footer">
          <Link
            href="#research"
            className="text-xs font-light text-[rgba(215,230,190,0.5)] transition hover:text-[var(--accent-hover)]"
          >
            Research
          </Link>
          <Link
            href="#methodology"
            className="text-xs font-light text-[rgba(215,230,190,0.5)] transition hover:text-[var(--accent-hover)]"
          >
            Methodology
          </Link>
          <Link
            href="#services"
            className="text-xs font-light text-[rgba(215,230,190,0.5)] transition hover:text-[var(--accent-hover)]"
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="text-xs font-light text-[rgba(215,230,190,0.5)] transition hover:text-[var(--accent-hover)]"
          >
            Contact
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-14 max-w-6xl border-t border-[rgba(140,180,120,0.06)] pt-6 text-[11px] font-light text-[rgba(215,230,190,0.25)]">
        © {new Date().getFullYear()} Telcore Research. Video: peaks and alpine
        landscape — used for demonstration.
      </p>
    </footer>
  );
}
