import type { Metadata } from "next";

import { PageHero } from "@/components/common/page-hero";
import { FullBleedMediaSectionList } from "@/components/sections/full-bleed-media-section";
import { servicesListingSections } from "@/data/services-listing-sections";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services | Telcorepublic Research",
  description:
    "Disrupter Quintants, competitive positioning, go-to-market, market assessment, custom research, and subscription — how Telco Republic supports telecom OSS and BSS leaders.",
};

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
