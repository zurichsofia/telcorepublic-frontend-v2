import { client } from "@/sanity/client";
import {
  newsArticleBySlugQuery,
  newsArticleListQuery,
  newsCountQuery,
  newsSlugsQuery,
  type NewsArticle,
  type NewsArticleListItem,
} from "@/sanity/queries";
import { coverImageUrl } from "@/sanity/image";

export type NewsPost = {
  slug: string;
  sourceUrl: string | null;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
  dateLabel: string;
  metaDescription: string;
  authors: string | null;
};

export type NewsPostDetail = NewsPost & {
  body: NewsArticle["body"];
};

function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase()
    .replace(",", "");
}

function toNewsPost(article: NewsArticleListItem): NewsPost {
  return {
    slug: article.slug,
    sourceUrl: article.sourceUrl,
    title: article.title,
    excerpt: article.excerpt ?? "",
    coverImage: coverImageUrl(article.coverImage),
    publishedAt: article.publishedAt,
    dateLabel: formatDateLabel(article.publishedAt),
    metaDescription: article.metaDescription ?? article.excerpt ?? "",
    authors: article.authors,
  };
}

export async function getAllNewsPosts(): Promise<readonly NewsPost[]> {
  const articles = await client.fetch<NewsArticleListItem[]>(
    newsArticleListQuery,
    {},
    { next: { tags: ["news"] } },
  );
  return articles.map(toNewsPost);
}

export async function getNewsPostBySlug(
  slug: string,
): Promise<NewsPostDetail | undefined> {
  const article = await client.fetch<NewsArticle | null>(
    newsArticleBySlugQuery,
    { slug },
    { next: { tags: ["news", `news:${slug}`] } },
  );
  if (!article) return undefined;

  return {
    ...toNewsPost(article),
    body: article.body,
  };
}

export async function getAllNewsSlugs(): Promise<string[]> {
  return client.fetch<string[]>(
    newsSlugsQuery,
    {},
    { next: { tags: ["news"] } },
  );
}

export async function getNewsArticleCount(): Promise<number> {
  return client.fetch<number>(
    newsCountQuery,
    {},
    { next: { tags: ["news"] } },
  );
}
