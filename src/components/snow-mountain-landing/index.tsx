"use client";

// import { ContactSection, ServicesSection } from "@/components/landing/sections";
import { GlobalReachMapSection } from "../landing/global-reach-map";
import { ServiceVideoHero } from '../landing/service-video-hero/service-video-hero';


export type SnowMountainLandingProps = {
  heroInitialSlug?: string;
};

export function SnowMountainLanding({ heroInitialSlug }: SnowMountainLandingProps = {}) {
  return (
    <>
      <ServiceVideoHero initialSlug={heroInitialSlug} />
      {/* <SnowMountainHero /> */}

      <div>
        <GlobalReachMapSection />
        {/* <ServicesSection />
        <ContactSection /> */}
      </div>
    </>
  );
}
