import { GlobalReachMapSection } from "@/components/landing/sections/global-reach/global-reach-map-section";
import { GetInTouchSection } from "@/components/landing/sections/get-in-touch-section";
import { InsightsQuotesSection } from "@/components/landing/sections/insights-quotes-section";
import { WhyUsSection } from "@/components/landing/sections/why-us/why-us-section";
import { SnowMountainHero } from "@/components/landing/snow-mountain/hero/snow-mountain-hero";

export default function MountainV2ScenePage() {
  return (
    <main id="home" className="relative z-10 isolate overflow-x-clip bg-white">
      <SnowMountainHero sceneVariant="v2" />
      <GlobalReachMapSection />
      <WhyUsSection />
      <InsightsQuotesSection videoSrc="/videos/TelcoRepublic_Ocean_1280x720.mp4" />
      <GetInTouchSection />
    </main>
  );
}
