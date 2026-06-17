import { InsightsQuotesSection } from "@/components/landing/sections/insights-quotes/insights-quotes-section";
import { NewsHeroStackedTitle } from "@/components/news/news-hero-stacked-title";
import { NewsList } from "@/components/news/news-list";
import { getAllNewsPosts, newsPostsToInsightQuotes } from "@/data/news";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata.news;

export const revalidate = 60;

export default async function NewsIndexPage() {
  const posts = await getAllNewsPosts();
  const [first, second, ...rest] = posts;
  const gridPosts = rest;
  const quotes = newsPostsToInsightQuotes(posts);

  return (
    <div>
      <InsightsQuotesSection
        quotes={quotes}
        showTopImage={false}
        showBottomVideo={false}
        heroTitle
      />

      <div
        className="mx-auto max-w-7xl px-6 pb-28 pt-36 sm:px-10 sm:pb-32 sm:pt-48"
        aria-labelledby="news-hero-title"
      >

        <NewsList
          hero={<NewsHeroStackedTitle className="max-w-lg lg:top-6" />}
          first={first}
          second={second}
          gridPosts={gridPosts}
        />
      </div>
    </div>
  );
}
