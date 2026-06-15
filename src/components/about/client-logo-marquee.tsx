import Image from "next/image";

import { clientLogos, type ClientLogo } from "@/data/clients";

function ClientLogoItem({ client }: { client: ClientLogo; }) {
  const scale = client.scale ?? 1;

  return (
    <div className="flex shrink-0 items-center justify-center px-10 sm:px-12 lg:px-14">
      <Image
        src={client.src}
        alt={client.name}
        width={client.width}
        height={client.height}
        className="h-20 w-auto object-contain sm:h-24 lg:h-28"
        style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      />
    </div>
  );
}

export function ClientLogoMarquee() {
  const marqueeLogos = [...clientLogos, ...clientLogos];

  return (
    <section
      className="client-logo-marquee relative overflow-hidden py-8 sm:py-10"
      aria-label="Client logos"
    >
      <div className="client-logo-marquee-track flex w-max items-center">
        {marqueeLogos.map((client, index) => (
          <ClientLogoItem key={`${client.name}-${index}`} client={client} />
        ))}
      </div>
    </section>
  );
}
