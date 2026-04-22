import type { Metadata } from "next";

import { NewsHeroStackedTitle } from "@/components/news/news-hero-stacked-title";
import { NewsList } from "@/components/news/news-list";
import { Footer } from "@/components/common/footer";
import { Navigation } from "@/components/common/navigation";
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
    <div className="relative z-10 flex min-h-screen flex-col bg-telco-dark">
      <Navigation theme="blog" />
      <main className="flex-1">
        <section
          className="mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 sm:pb-24 sm:pt-8"
          aria-labelledby="news-hero-title"
        >
          <NewsList
            hero={<NewsHeroStackedTitle className="max-w-lg lg:top-6" />}
            first={first}
            second={second}
            gridPosts={gridPosts}
          />
        </section>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
