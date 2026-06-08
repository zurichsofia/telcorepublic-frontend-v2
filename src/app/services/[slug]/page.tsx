import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServiceBySlug } from "@/data/services";
import { ServiceWrapper } from "@/components/service/service-wrapper";
import { defaultMetadata, getServicePageMetadata } from "@/lib/page-metadata";

type ServiceLandingProps = {
  params: Promise<{ slug: string; }>;
};

export async function generateMetadata({
  params,
}: ServiceLandingProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return defaultMetadata;
  return getServicePageMetadata(service);
}

export default async function ServiceLanding({ params }: ServiceLandingProps) {
  const { slug } = await params;
  if (!getServiceBySlug(slug)) notFound();

  return (
    <main id="home" className="relative z-10 isolate">
      <ServiceWrapper initialSlug={slug} />
    </main>
  );
}
