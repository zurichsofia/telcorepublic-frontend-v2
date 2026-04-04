import { FirstSectionsParallaxBg } from "@/components/landing/first-sections-parallax-bg";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import {
  StatementBand,
  InsightsSection,
  ContactSection,
} from "@/components/landing/sections";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <main>
        <FirstSectionsParallaxBg>
          <Hero />
        </FirstSectionsParallaxBg>
        <StatementBand />
        <Marquee />
        <InsightsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
