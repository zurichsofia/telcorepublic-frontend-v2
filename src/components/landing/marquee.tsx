export function Marquee() {
  const line = "— clarity at scale —";
  const repeated = Array(12).fill(line).join(" ");

  return (
    <div className="border-y border-white/[0.06] bg-[#07090c] py-4 overflow-hidden">
      <p
        className="animate-drift whitespace-nowrap font-[family-name:var(--font-display)] text-sm text-white/25 sm:text-base"
        aria-hidden
      >
        {repeated}
      </p>
    </div>
  );
}
