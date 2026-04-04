import { FirstSectionsParallaxBg } from "@/components/landing/first-sections-parallax-bg";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import {
  BrandStatements,
  ServicesSection,
  ContactSection,
} from "@/components/landing/sections";
import { GlobalReachMapSection } from "@/components/landing/global-reach-map";
import { WhyTelcoRepublicSection } from "@/components/landing/why-telco-republic";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <main>
        <FirstSectionsParallaxBg>
          <Hero />
          <BrandStatements />
        </FirstSectionsParallaxBg>
        <Marquee />
        <GlobalReachMapSection />
        <ServicesSection />
        <WhyTelcoRepublicSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
