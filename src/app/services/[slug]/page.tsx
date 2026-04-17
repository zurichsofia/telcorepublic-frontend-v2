import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServiceBySlug } from "@/data/services";
import { GlobalReachMapSection } from "@/components/landing/global-reach-map";
import { ServicesSection } from "@/components/landing/services-section";
import { ServiceVideoHero } from "@/components/landing/service-video-hero/service-video-hero";

const defaultMetadata: Metadata = {
  title: "Telcorepublic Research",
  description:
    "Premium telecom research-spectrum, infrastructure, and intelligence with clarity.",
};

type ServiceLandingProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ServiceLandingProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return defaultMetadata;
  return {
    title: `${service.title} | Telcorepublic Research`,
    description: service.desc,
  };
}

export default async function ServiceLanding({ params }: ServiceLandingProps) {
  const { slug } = await params;
  if (!getServiceBySlug(slug)) notFound();

  return (
    <main id="home" className="relative z-10 isolate">
      <ServiceVideoHero initialSlug={slug} />
      <ServicesSection />
      <GlobalReachMapSection />
    </main>
  );
}
