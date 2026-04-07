"use client";

import { ContactSection, ServicesSection } from "@/components/landing/sections";

import { SnowMountainHero } from "./snow-mountain-hero";
import { GlobalReachMapSection } from '../landing/global-reach-map';

export function SnowMountainLanding() {
  return (
    <>
      <SnowMountainHero />

      <div className="theme-snow-ice relative border-t border-cyan-500/20 bg-gradient-to-b from-[#f2f9ff] via-[#f2f9ff] to-[#f2f9ff]">
        <GlobalReachMapSection />
        <ServicesSection />
        <ContactSection />
      </div>
    </>
  );
}
