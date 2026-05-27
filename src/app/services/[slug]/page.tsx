import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServiceBySlug } from "@/data/services";
import { ServiceWrapper } from "@/components/service/service-wrapper";

const defaultMetadata: Metadata = {
  title: "Telcorepublic Research",
  description:
    "Premium telecom research-spectrum, infrastructure, and intelligence with clarity.",
};

type ServiceLandingProps = {
  params: Promise<{ slug: string; }>;
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
      <ServiceWrapper initialSlug={slug} />
    </main>
  );
}
