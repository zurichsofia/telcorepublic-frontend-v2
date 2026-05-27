import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAllNewsSlugs,
  getNewsPostBySlug,
} from "@/data/news";
import { NewsArticleBody } from "@/components/news/news-article-body";

const defaultMetadata: Metadata = {
  title: "News | Telcorepublic Research",
  description: "News and updates from Telco Republic.",
};

type NewsArticleProps = {
  params: Promise<{ slug: string; }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewsArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) return defaultMetadata;
  return {
    title: `${post.title} | Telcorepublic Research`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function NewsArticlePage({ params }: NewsArticleProps) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-48">
      <p className="text-[10px] font-normal tracking-[0.2em] text-white/90 sm:text-xs">
        {post.dateLabel}
      </p>
      <h1 className="mt-6 font-display text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
        {post.title}
      </h1>
      {post.authors ? (
        <p className="mt-4 text-sm font-light text-white/60">
          Author: {post.authors}
        </p>
      ) : null}

      {post.coverImage ? (
        <div className="relative mt-12 aspect-21/9 w-full max-w-4xl overflow-hidden bg-neutral-900 sm:mt-14 sm:aspect-2/1">
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

      <div className="mt-12 sm:mt-16">
        <NewsArticleBody value={post.body} />
      </div>

      <p className="mt-16 border-t border-white/10 pt-12 text-sm font-light text-white/50 sm:mt-20 sm:pt-14">
        {post.sourceUrl ? (
          <>
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
          </>
        ) : null}
        <Link
          href="/news"
          className="text-white/80 transition hover:text-white"
        >
          All news
        </Link>
      </p>
    </main>
  );
}
