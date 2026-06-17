import { GlobalReachMapSection } from "@/components/landing/sections/global-reach/global-reach-map-section";
import { GetInTouchSection } from "@/components/landing/sections/get-in-touch-section";
import { InsightsQuotesSection } from "@/components/landing/sections/insights-quotes-section";
import { WhyUsSection } from "@/components/landing/sections/why-us/why-us-section";
import { YoutubeVideoSection } from "@/components/landing/sections/youtube-video-section";
import { SnowMountainHero } from "@/components/landing/snow-mountain/hero/snow-mountain-hero";
import { getAllNewsPosts, newsPostsToInsightQuotes } from "@/data/news";

export default async function Home() {
  const posts = await getAllNewsPosts();
  const quotes = newsPostsToInsightQuotes(posts);

  return (
    <main id="home" className="relative z-10 isolate overflow-x-clip bg-white">
      <SnowMountainHero />
      <GlobalReachMapSection />
      <YoutubeVideoSection />
      <WhyUsSection />
      <InsightsQuotesSection quotes={quotes} />
      <GetInTouchSection />
    </main>
  );
}
