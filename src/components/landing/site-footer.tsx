import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050608] px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight text-[#f4f2ed]">
            Telcorepublic
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/45">
            Independent research for the people who design, regulate, and invest in
            connectivity.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm" aria-label="Footer">
          <Link href="#research" className="text-white/50 hover:text-white/80">
            Research
          </Link>
          <Link href="#methodology" className="text-white/50 hover:text-white/80">
            Methodology
          </Link>
          <Link href="#insights" className="text-white/50 hover:text-white/80">
            Insights
          </Link>
          <Link href="#contact" className="text-white/50 hover:text-white/80">
            Contact
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-14 max-w-6xl text-xs text-white/30">
        © {new Date().getFullYear()} Telcore Research. Video: peaks and alpine
        landscape — used for demonstration.
      </p>
    </footer>
  );
}
