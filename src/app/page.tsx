import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import {
  IntroSection,
  MethodologySection,
  StatementBand,
  InsightsSection,
  ContactSection,
} from "@/components/landing/sections";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <IntroSection />
        <MethodologySection />
        <StatementBand />
        <InsightsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
