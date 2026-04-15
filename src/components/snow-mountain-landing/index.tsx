"use client";

import { ContactSection, ServicesSection } from "@/components/landing/sections";

import { ServiceVideoHero } from "./service-video-hero/service-video-hero";
import { GlobalReachMapSection } from '../landing/global-reach-map';

export function SnowMountainLanding() {
  return (
    <>
      <ServiceVideoHero />
      {/* <SnowMountainHero /> */}

      <div className="theme-snow-ice relative border-t border-[var(--color-clouds)]/25 bg-[#ffffff]">
        <GlobalReachMapSection />
        <ServicesSection />
        <ContactSection />
      </div>
    </>
  );
}
