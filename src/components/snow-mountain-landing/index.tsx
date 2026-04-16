"use client";

import { ContactSection, ServicesSection } from "@/components/landing/sections";

import { GlobalReachMapSection } from "../landing/global-reach-map";

import { ServiceVideoHero } from "./service-video-hero/service-video-hero";

export type SnowMountainLandingProps = {
  heroInitialSlug?: string;
};

export function SnowMountainLanding({ heroInitialSlug }: SnowMountainLandingProps = {}) {
  return (
    <>
      <ServiceVideoHero initialSlug={heroInitialSlug} />
      {/* <SnowMountainHero /> */}

      <div className="theme-snow-ice relative border-t border-[var(--color-clouds)]/25 bg-[#ffffff]">
        <GlobalReachMapSection />
        <ServicesSection />
        <ContactSection />
      </div>
    </>
  );
}
