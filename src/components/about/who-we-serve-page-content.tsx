import { AboutVideoStrip } from "@/components/about/about-video-strip";
import { WhoWeServeAudienceSection } from "@/components/about/who-we-serve-audience-section";
import { PageHero } from "@/components/common/page-hero";

const WHO_WE_SERVE_VIDEO_SRC = "/videos/about/Coast_Ocean_1280x720.mp4";

const audienceSegments = [
  {
    name: "Independent Software Vendors (ISVs)",
    description:
      "Gain access to a collaborative ecosystem and expert guidance, accelerating the integration and commercialization of your solutions.",
  },
  {
    name: "Communications Service Providers (CSPs)",
    description:
      "Benefit from curated partnerships and innovative technologies, enabling you to enhance your service offerings and streamline digital transformation.",
  },
  {
    name: "Network Equipment Providers (NEPs)",
    description:
      "Leverage Telco Republic\u2019s network to connect with industry leaders and emerging technology solutions, fostering co-innovation and expanding your market reach.",
  },
  {
    name: "Over-the-Top Providers (OTTs)",
    description:
      "Collaborate with telecom stakeholders, unlocking new distribution channels and monetization opportunities for your digital services.",
  },
  {
    name: "Hyperscalers",
    description:
      "Utilize Telco Republic\u2019s expertise to forge strategic alliances and integrate your cloud solutions seamlessly into the telecom value chain.",
  },
  {
    name: "Investors",
    description:
      "Gain unique insight into cutting-edge telecom solutions and access to a vetted pipeline of high-potential startups and growth opportunities.",
  },
  {
    name: "Startups",
    description:
      "Receive mentorship, exposure and partnership opportunities, accelerating your go-to-market journey and scaling your telecom innovations.",
  },
] as const;

export function WhoWeServePageContent() {
  return (
    <div className="">
      <PageHero
        className="mb-16 h-[calc(100dvh-5.5rem)] pb-0 pt-0 sm:mb-20 sm:pb-0 sm:pt-0"
        title="Who We Serve"
        description="We provide nimble, leading-edge advisory services addressing market disruption and innovation at an attractive price-performance ratio to a variety of constituents."
      />


      <WhoWeServeAudienceSection segments={audienceSegments} />

      <AboutVideoStrip videoSrc={WHO_WE_SERVE_VIDEO_SRC} />

    </div>
  );
}
