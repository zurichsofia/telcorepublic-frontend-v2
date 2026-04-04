const CLIENTS = [
  "HPE",
  "AWS",
  "Netcracker",
  "Kloudville",
  "Symphonica",
  "Intraway",
] as const;

export function Marquee() {
  const clients = CLIENTS.join(" · ");
  const line = `${clients}`;
  const repeated = Array(12).fill(line).join(" ");

  return (
    <div className="overflow-hidden border-y border-[rgba(140,180,220,0.1)] bg-black/20 py-4 backdrop-blur-[1px]">
      <p
        className="animate-drift whitespace-nowrap text-sm font-light text-[rgba(180,210,235,0.22)] sm:text-base"
        aria-hidden
      >
        {repeated}
      </p>
    </div>
  );
}
