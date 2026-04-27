import { WhyUsSection } from "@/components/snow-mountain-landing/WhyUsSection";
import { SnowMountainHero } from "@/components/snow-mountain-landing/snow-mountain-hero";

export default function Home() {
  return (
    <main id="home" className="relative z-10 isolate">
      <SnowMountainHero />
      <WhyUsSection />
    </main>
  );
}
