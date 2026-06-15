import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/common/page-hero";
import { HighlightsGrid } from "@/components/service/service-details/highlights-grid";
import { InlineList } from "@/components/service/service-details/inline-list";
import { PillarsSection } from "@/components/service/service-details/pillars-section";
import {
  serviceDetailColumn,
  serviceDetailHeading,
  serviceDetailStack,
} from "@/components/service/service-details/service-detail-styles";
import { cn } from "@/lib/utils";

const industryPillars = [
  {
    label: "Innovate",
    text: "Cognitive business models in the digital economy require an innovation of software architectures.",
  },
  {
    label: "Reinvent",
    text: "All actors in the telco business have to reinvent themselves, whether they are telco providers or vendors selling to providers.",
  },
] as const;

const paradigmItems = [
  "Agile leadership",
  "Cultural change management",
  "Adaptive organizational models",
  "Embedded in streamlined SecDevOps",
] as const;

const globalNetworkParagraphs = [
  "Our network spans continents, connecting thought leaders, strategists and innovators who collaborate seamlessly to address client needs, wherever they arise.",
  "At Telco Republic, we unite a worldwide community of industry leaders, strategists and innovators.",
  "This collective expertise allows us to deliver actionable insights and tailored solutions, no matter the market or the challenge.",
  "From North America to Europe and Asia-Pacific, our experts work alongside clients to navigate disruption, seize opportunities and accelerate growth in the dynamic world of telecommunications.",
  "No matter the challenge, our international team delivers tailored solutions by tapping into deep expertise across all facets of the telecommunications ecosystem.",
  "Our background makes us uniquely qualified to cover the new market for next generation telecoms operations and business management systems.",
  "For every engagement, we assemble a tailored team of specialists, drawing from our global network to match the precise needs of our clients.",
  "Our services are personalized and flexible, at an attractive price/performance ratio.",
] as const;

const expertiseHighlights = [
  {
    name: "Qualifications",
    description:
      "We have worked for leading global analyst research firms, such as Gartner, for decades. We have tracked the industry and followed its players since the 1990s, with an established global contact network of vendors and service providers. We are deeply engaged with leading industry standards organizations, startups and investor communities.",
  },
  {
    name: "Disrupter Quintant",
    description:
      "The Telco Republic Disrupter Quintant keeps track of the new, re-defined telco management supplier landscape serving telcos in the digital era.",
  },
  {
    name: "Recurring insights",
    description:
      "The Disrupter Quintant is complemented with strategic market analysis, competitive insights, go-to-market advice, messaging, positioning, technology ROI and business case presentation.",
  },
  {
    name: "Implementation advice",
    description:
      "Beyond the strategic level, we provide perceptive and practical implementation advice on how to turn technology innovation opportunities into business opportunities.",
  },
] as const;

export function ExpertisePageContent() {
  return (
    <div className="pb-8 sm:pb-12">
      <PageHero
        className="mb-28 sm:mb-40"
        title="Expertise"
        subtitle="We bring together global industry experts and cutting-edge innovation at scale."
        description="Ensuring that every project benefits from world-class insights and local market knowledge."
      />

      <div
        className={cn(
          serviceDetailColumn,
          serviceDetailStack,
          "gap-y-24 md:gap-y-32 lg:gap-y-40",
        )}
      >
        <h2 className={serviceDetailHeading}>
          The telecoms industry has changed, and the way of doing business in evolving
          industry value creation chains is fluid.
        </h2>

        <PillarsSection items={industryPillars} />

        <InlineList
          heading="The new operating paradigm requires"
          items={paradigmItems}
        />
      </div>

      <article className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-8 lg:py-52">
        <header>
          <p className="text-xl font-bold leading-tight tracking-wider text-telco-red">
            Global network
          </p>
          <h2 className="mt-2 font-display text-4xl text-telco-red sm:text-5xl">
            Worldwide expertise
          </h2>
        </header>
        <div className="mt-10 space-y-5 text-base md:text-xl font-light text-telco-dark sm:mt-12">
          {globalNetworkParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>


      </article>

      <section
        className={cn(serviceDetailColumn, "py-20 md:py-32 lg:py-40")}
        aria-label="What we offer"
      >
        <HighlightsGrid items={expertiseHighlights} />
      </section>

      <figure className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
        <Image
          src="/images/about/expertise/global-network.png"
          alt="Telco Republic global network: industry focus, vendor evaluation expertise, trusted partnerships, consolidated knowledge, executive network, and price-performance ratio"
          width={1200}
          height={675}
          className="mx-auto h-auto w-full object-contain"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </figure>

      <section
        className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-20 text-center text-pretty sm:gap-10 sm:px-8 sm:py-28"
        aria-label="Contact"
      >
        <h2 className="font-display text-3xl leading-tight text-telco-red sm:text-4xl lg:text-5xl">
          Ready to access the world&apos;s leading telecom minds?
        </h2>
        <p className="max-w-2xl text-lg font-light leading-relaxed text-telco-dark sm:text-xl">
          <Link
            href="/contact"
            className="text-telco-red underline underline-offset-4 transition-opacity hover:opacity-75"
          >
            Contact us
          </Link>{" "}
          to learn how our global experts can drive your next project forward.
        </p>
      </section>
    </div>
  );
}
