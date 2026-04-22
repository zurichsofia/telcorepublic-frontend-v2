import raw from "./news-posts.json";

export type NewsContentBlock =
  | { type: "paragraph"; text: string; }
  | { type: "heading"; level: number; text: string; }
  | { type: "list"; ordered: boolean; items: string[]; }
  | { type: "image"; src: string; };

export type NewsPost = {
  slug: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  dateLabel: string;
  metaDescription: string;
  content: readonly NewsContentBlock[];
  authors: string | null;
};

const posts = raw as readonly NewsPost[];

export const blogPosts: readonly NewsPost[] = posts;

export function getAllNewsSlugs(): string[] {
  return posts.map((p) => p.slug);
}

export function getNewsPostBySlug(slug: string): NewsPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllNewsPosts(): readonly NewsPost[] {
  return posts;
}
