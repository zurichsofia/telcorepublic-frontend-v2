import { GlobalReachMapSection } from "@/components/landing/global-reach-map";
import { InsightsQuotesSection } from "@/components/snow-mountain-landing/InsightsQuotesSection";
import { WhyUsSection } from "@/components/snow-mountain-landing/WhyUsSection";
import { SnowMountainHero } from "@/components/snow-mountain-landing/snow-mountain-hero";

export default function Home() {
  return (
    <main id="home" className="relative z-10 isolate">
      <SnowMountainHero />
      <WhyUsSection />
      {/* <GlobalReachMapSection /> */}
      <InsightsQuotesSection videoSrc="/videos/TelcoRepublic_Ocean_1280x720.mp4" />
    </main>
  );
}
