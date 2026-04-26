import type { Metadata } from "next";

import { NewsHeroStackedTitle } from "@/components/news/news-hero-stacked-title";
import { NewsList } from "@/components/news/news-list";
import { getAllNewsPosts } from "@/data/news";

export const metadata: Metadata = {
  title: "News | Telcorepublic Research",
  description:
    "Latest news, research updates, and industry perspectives from Telco Republic.",
};

export default function NewsIndexPage() {
  const posts = getAllNewsPosts();
  const [first, second, ...rest] = posts;
  const gridPosts = rest;

  return (
    <div>
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
