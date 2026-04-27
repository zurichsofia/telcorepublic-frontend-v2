"use client";

import Link from "next/link";

const links = [
  { href: "#research", label: "Research" },
  { href: "#methodology", label: "Methodology" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-[2] overflow-hidden border-t border-[rgba(255,255,255,0.06)] px-5 py-14 sm:px-8">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-black">
            Telcorepublic
          </p>
          <p className="mt-2 max-w-xs text-xs font-light leading-relaxed text-clouds">
            Independent research for the people who design, regulate, and invest in
            connectivity.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm" aria-label="Footer">
          {links.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="text-xs font-light text-clouds transition hover:text-black"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
      <div className="relative mx-auto mt-14 max-w-6xl border-t border-[rgba(255,255,255,0.06)] pt-6">
        <p className="text-xs font-light text-slate-900">
          © {new Date().getFullYear()} Telcore Research. Video: peaks and alpine landscape -
          used for demonstration.
        </p>
      </div>
    </footer>
  );
}
