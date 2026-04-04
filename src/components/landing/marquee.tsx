export function Marquee() {
  const line = "— clarity at scale —";
  const repeated = Array(12).fill(line).join(" ");

  return (
    <div className="border-y border-white/[0.08] bg-black/25 py-4 backdrop-blur-[1px] overflow-hidden">
      <p
        className="animate-drift whitespace-nowrap text-sm font-medium text-white/25 sm:text-base"
        aria-hidden
      >
        {repeated}
      </p>
    </div>
  );
}
