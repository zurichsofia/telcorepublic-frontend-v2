import type { Metadata } from "next";

import { Footer } from "@/components/common/footer";
import { Navigation } from "@/components/common/navigation";
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
  href: `#${s.slug}`,
}));

export default function ServicesPage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-white">
      <Navigation />
      <main className="flex-1">
        <PageHero title="What we provide" links={heroLinks} />
        <FullBleedMediaSectionList items={servicesListingSections} />
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
