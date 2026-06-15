import { ClientLogoMarquee } from "@/components/about/client-logo-marquee";
import { PageHero } from "@/components/common/page-hero";

export function ClientsPageContent() {
  return (
    <div className="pb-8 sm:pb-12">
      <PageHero
        className="mb-20 sm:mb-28"
        title="Our Clients"
        subtitle="Clients for whom we are privileged to work."
      />

      <ClientLogoMarquee />
    </div>
  );
}
