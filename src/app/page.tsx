import { LandingBelowFoldSections } from "@/components/landing/landing-below-fold-sections";
import { SnowMountainHero } from "@/components/landing/snow-mountain/hero/snow-mountain-hero-dynamic";
import { getAllNewsPosts, newsPostsToInsightQuotes } from "@/data/news";

export default async function Home() {
  const posts = await getAllNewsPosts();
  const quotes = newsPostsToInsightQuotes(posts);

  return (
    <main id="home" className="relative z-10 isolate overflow-x-clip bg-white">
      <SnowMountainHero />
      <LandingBelowFoldSections quotes={quotes} />
    </main>
  );
}
