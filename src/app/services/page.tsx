import { PageHero } from "@/components/common/page-hero";

import { servicesListingSections } from "@/data/services-listing-sections";
import { services } from "@/data/services";
import { FullBleedMediaSectionList } from '@/components/common/full-bleed-media-section';
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata.services;

const heroLinks = services.map((s) => ({
  label: s.title,
  href: `/services/${s.slug}`,
}));

export default function ServicesPage() {
  return (
    <div>
      <PageHero title="What we provide" links={heroLinks} />
      <FullBleedMediaSectionList items={servicesListingSections} />
    </div>
  );
}
