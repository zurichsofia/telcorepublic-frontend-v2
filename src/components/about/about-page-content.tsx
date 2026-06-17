import Link from "next/link";

import {
  AudienceSegmentGrid,
  type AudienceSegment,
} from "@/components/about/audience-segment-grid";
import { PageHero } from "@/components/common/page-hero";
import { ServiceDetailLead } from "@/components/service/service-details/service-detail-lead";
import { PillarsSection } from "@/components/service/service-details/pillars-section";
import {
  serviceDetailBody,
  serviceDetailColumn,
  serviceDetailHeading,
  serviceDetailStack,
} from "@/components/service/service-details/service-detail-styles";
import { cn } from "@/lib/utils";

const advisoryAudiences: readonly AudienceSegment[] = [
  {
    name: "Technology Vendors",
    description:
      "We advise technology vendors on their strategic positioning and messaging. This includes innovation start-ups.",
  },
  {
    name: "Communications Service Providers",
    description:
      "We advise communications service providers on their strategic purchasing decisions.",
  },
  {
    name: "Investors",
    description:
      "We advise investors regarding their strategic investment decisions.",
  },
];

const commitmentItems = [
  {
    text: "Within three months, we can help you define a new strategic technology vision and guide you on the initial execution of this vision.",
  },
  {
    text: "We provide rigorous, in-depth benchmarking analysis of the players in this market.",
  },
  {
    text: "Our services center on rigorous, well-vetted market ranking and capability assessments, based on a proven, fact-based rating methodology of respective companies in a given market.",
  },
] as const;

const contentSections = [
  {
    title: "The World is Changing, and so is the Telecom Market",
    paragraphs: [
      "Consumers, businesses and the way the society connects remain in flux. The proliferation of new innovation technologies, such as generative AI, cloud, 5G and edge have lowered entry barriers. The disruption potential of new players has changed market dynamics with new digital types of telco services and business models.",
    ],
  },
  {
    title: "Telcos Will Have to Reinvent Themselves",
    paragraphs: [
      "Telcos have to find new ways of creating, designing and delivering services and to establish a new role in the evolving digital economy. Beyond new business and operating models, comprehensive change management initiatives will trigger vast organizational, cultural, behavioral and skillset changes.",
    ],
  },
  {
    title: "We Provide Rigorous, In-Depth Benchmarking Analysis to All Players",
    paragraphs: [
      "Our services center on accurate, well-vetted market rankings and capability assessments, based on a proven, fact-based rating methodology of respective companies in a given market.",
    ],
  },
] as const;

export function AboutPageContent() {
  return (
    <div className="pb-12 sm:pb-16">
      <PageHero
        className="mb-12 sm:mb-28 md:mb-40"
        title="About Us"
        subtitle="Crossing the Telco Chasm"
        description="We are the go-to, thought-provoking market research and advisory firm for the new telecom software market."
      />

      <div className="flex flex-col gap-y-32 sm:gap-y-36 md:gap-y-40 lg:gap-y-48">
        <ServiceDetailLead
          className="pt-0 sm:pt-12 md:pt-24"
          title="Our mission is to track ongoing disruption and innovation related to telecommunications business and operations."
          intro="As a boutique firm we focus specifically on emerging management systems and applications that allow operationalization and monetization of emerging technologies, operating models and market value creation ecosystems."
        />

        <section
          className="mx-auto w-full max-w-7xl px-5 sm:px-8"
          aria-label="Who we advise"
        >
          <AudienceSegmentGrid
            columns={3}
            segments={advisoryAudiences}
            className="gap-y-20 sm:gap-y-14 lg:gap-y-16"
          />
        </section>

        <section
          className={serviceDetailColumn}
          aria-labelledby="our-commitment-heading"
        >
          <h2
            id="our-commitment-heading"
            className={cn(serviceDetailHeading, "mb-20 sm:mb-24 md:mb-28")}
          >
            Our Commitment
          </h2>
          <PillarsSection
            items={commitmentItems}
            className="space-y-20 sm:space-y-16 md:space-y-20"
          />
        </section>

        <div
          className={cn(
            serviceDetailColumn,
            "flex flex-col gap-y-32 sm:gap-y-36 md:gap-y-40 lg:gap-y-48",
          )}
        >
          {contentSections.map((section) => (
            <article
              key={section.title}
              className={cn(serviceDetailStack, "gap-y-8 sm:gap-y-6 md:gap-y-8")}
            >
              <h2 className={serviceDetailHeading}>{section.title}</h2>
              <div className={cn(serviceDetailStack, "gap-y-5 md:gap-y-6")}>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={serviceDetailBody}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section
          className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pt-4 text-center text-pretty sm:gap-10 sm:px-8 sm:pt-8 lg:pt-12"
          aria-label="Contact"
        >
          <p className="text-sm uppercase tracking-widest text-telco-dark sm:text-base">
            Do you need consulting?
          </p>
          <h2 className="font-display text-3xl leading-tight text-telco-red sm:text-4xl lg:text-5xl">
            We will be glad to advise you!
          </h2>
          <Link
            href="/contact"
            className="text-2xl text-telco-red underline underline-offset-[0.3em] transition-opacity hover:opacity-75 sm:text-3xl lg:text-4xl"
          >
            Contact
          </Link>
        </section>
      </div>
    </div>
  );
}
