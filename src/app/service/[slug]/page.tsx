import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SnowMountainLanding } from "@/components/snow-mountain-landing";
import { getServiceBySlug, services } from "@/data/services";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return { title: "Service" };
  }
  return {
    title: `${service.title} | Telcorepublic Research`,
    description: service.desc,
  };
}

export default async function ServiceHeroPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main id="home" className="relative z-10 isolate">
      <SnowMountainLanding heroInitialSlug={slug} />
    </main>
  );
}
