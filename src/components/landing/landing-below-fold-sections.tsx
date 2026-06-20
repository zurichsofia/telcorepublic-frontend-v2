"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import type { InsightQuote } from "@/data/news";

const GlobalReachMapSection = dynamic(() =>
  import("@/components/landing/sections/global-reach/global-reach-map-section").then(
    (module) => module.GlobalReachMapSection,
  ),
);

const WhyUsSection = dynamic(() =>
  import("@/components/landing/sections/why-us/why-us-section").then(
    (module) => module.WhyUsSection,
  ),
);

const InsightsQuotesSection = dynamic(() =>
  import(
    "@/components/landing/sections/insights-quotes/insights-quotes-section"
  ).then((module) => module.InsightsQuotesSection),
);

type LandingBelowFoldSectionsProps = {
  quotes: readonly InsightQuote[];
  children?: ReactNode;
};

export function LandingBelowFoldSections({
  quotes,
  children,
}: LandingBelowFoldSectionsProps) {
  return (
    <>
      <GlobalReachMapSection />
      {children}
      <WhyUsSection />
      <InsightsQuotesSection quotes={quotes} />
    </>
  );
}
