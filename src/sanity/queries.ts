import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

export type NewsArticleListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: SanityImageSource | null;
  publishedAt: string;
  authors: string | null;
  metaDescription: string | null;
  sourceUrl: string | null;
};

export type NewsArticle = NewsArticleListItem & {
  body: PortableTextBlock[] | null;
};

export const newsArticleListQuery = `*[_type == "newsArticle"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  authors,
  metaDescription,
  sourceUrl
}`;

export const newsArticleBySlugQuery = `*[_type == "newsArticle" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  authors,
  metaDescription,
  sourceUrl,
  body
}`;

export const newsSlugsQuery = `*[_type == "newsArticle"].slug.current`;

export const newsCountQuery = `count(*[_type == "newsArticle"])`;
