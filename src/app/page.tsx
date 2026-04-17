import type { Metadata } from "next";

import { getServiceBySlug } from "@/data/services";
import { ServiceVideoHero } from '@/components/landing/service-video-hero/service-video-hero';
import { GlobalReachMapSection } from '@/components/landing/global-reach-map';

const defaultMetadata: Metadata = {
  title: "Telcorepublic Research",
  description:
    "Premium telecom research-spectrum, infrastructure, and intelligence with clarity.",
};

type HomePageProps = {
  searchParams: Promise<{ slug?: string; }>;
};

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const { slug } = await searchParams;
  if (!slug) return defaultMetadata;
  const service = getServiceBySlug(slug);
  if (!service) return defaultMetadata;
  return {
    title: `${service.title} | Telcorepublic Research`,
    description: service.desc,
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const { slug } = await searchParams;
  const heroInitialSlug =
    slug && getServiceBySlug(slug) ? slug : undefined;

  return (
    <main id="home" className="relative z-10 isolate">
      <ServiceVideoHero initialSlug={heroInitialSlug} />
      <GlobalReachMapSection />
    </main>
  );
}
