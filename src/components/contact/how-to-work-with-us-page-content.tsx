import Link from "next/link";

import { EngagementComparisonMatrix } from "@/components/contact/engagement-comparison-matrix";
import { EngagementModelsSection } from "@/components/contact/engagement-models-section";
import { PageHero } from "@/components/common/page-hero";
import { engagementModels } from "@/data/engagement-models";

export function HowToWorkWithUsPageContent() {
  return (
    <div className="min-w-0 pb-8 sm:pb-12">
      <PageHero
        className="mb-28 sm:mb-40"
        title="How To Work With Us"
        subtitle="We Offer Flexible Engagement Models that Meet Your Requirements."
        description="All engagement models include a free 30 minute initial consultation."
      />

      <EngagementModelsSection
        models={engagementModels}
        className="py-8 md:py-12 lg:py-16"
      />

      <EngagementComparisonMatrix className="mt-8 sm:mt-12 lg:mt-16" />

      <section
        className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-20 text-center text-pretty sm:gap-10 sm:px-8 sm:py-28"
        aria-label="Contact"
      >
        <h2 className="font-display text-3xl leading-tight text-telco-red sm:text-4xl lg:text-5xl">
          Ready to get started?
        </h2>
        <p className="max-w-2xl text-lg font-light leading-relaxed text-telco-dark sm:text-xl">
          <Link
            href="/contact"
            className="text-telco-red underline underline-offset-4 transition-opacity hover:opacity-75"
          >
            Contact us
          </Link>{" "}
          to schedule your free initial consultation or learn more about our subscription
          tiers.
        </p>
      </section>
    </div>
  );
}
