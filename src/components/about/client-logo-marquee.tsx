import Image from "next/image";

import { clientLogos, type ClientLogo } from "@/data/clients";
import { cn } from "@/lib/utils";

type ClientLogoMarqueeVariant = "default" | "inverse";

function ClientLogoItem({
  client,
  variant,
}: {
  client: ClientLogo;
  variant: ClientLogoMarqueeVariant;
}) {
  const scale = client.scale ?? 1;

  return (
    <div className="flex shrink-0 items-center justify-center px-10 sm:px-12 lg:px-14">
      <Image
        src={client.src}
        alt={client.name}
        width={client.width}
        height={client.height}
        className={cn(
          "h-20 w-auto object-contain sm:h-24 lg:h-28",
          variant === "inverse" && "brightness-0 invert",
        )}
        style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      />
    </div>
  );
}

export function ClientLogoMarquee({
  variant = "default",
  label,
  labelClassName,
  className,
}: {
  variant?: ClientLogoMarqueeVariant;
  label?: string;
  labelClassName?: string;
  className?: string;
}) {
  const marqueeLogos = [...clientLogos, ...clientLogos];

  return (
    <div
      className={cn("relative", className)}
      aria-label="Client logos"
      role="region"
    >
      {label ? (
        <p className={cn("absolute z-10", labelClassName)}>{label}</p>
      ) : null}
      <div
        className={cn(
          "client-logo-marquee relative w-full overflow-hidden",
          variant === "default" && "py-8 sm:py-10",
        )}
      >
        <div className="client-logo-marquee-track flex w-max items-center">
          {marqueeLogos.map((client, index) => (
            <ClientLogoItem
              key={`${client.name}-${index}`}
              client={client}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
