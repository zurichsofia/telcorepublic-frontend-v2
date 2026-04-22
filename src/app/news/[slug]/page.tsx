import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/common/footer";
import { Navigation } from "@/components/common/navigation";
import {
  getAllNewsSlugs,
  getNewsPostBySlug,
} from "@/data/news";
import { NewsArticleContent } from "@/components/news/news-article-content";

const defaultMetadata: Metadata = {
  title: "News | Telcorepublic Research",
  description: "News and updates from Telco Republic.",
};

type NewsArticleProps = {
  params: Promise<{ slug: string; }>;
};

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewsArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) return defaultMetadata;
  return {
    title: `${post.title} | Telcorepublic Research`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function NewsArticlePage({ params }: NewsArticleProps) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-telco-dark">
      <Navigation theme="blog" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8 sm:py-16">
        <p className="text-[10px] font-normal tracking-[0.2em] text-white/90 sm:text-xs">
          {post.dateLabel}
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        {post.authors ? (
          <p className="mt-4 text-sm font-light text-white/60">
            Author: {post.authors}
          </p>
        ) : null}

        {post.coverImage ? (
          <div className="relative mt-10 aspect-21/9 w-full max-w-4xl overflow-hidden bg-neutral-900 sm:aspect-2/1">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        ) : null}

        <div className="mt-10 sm:mt-12">
          <NewsArticleContent content={post.content} />
        </div>

        <p className="mt-12 border-t border-white/10 pt-10 text-sm font-light text-white/50">
          <a
            href={post.sourceUrl}
            className="text-white/80 underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
            rel="noopener noreferrer"
            target="_blank"
          >
            View original
          </a>
          <span className="mx-2 text-white/30" aria-hidden>
            ·
          </span>
          <Link
            href="/news"
            className="text-white/80 transition hover:text-white"
          >
            All news
          </Link>
        </p>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
