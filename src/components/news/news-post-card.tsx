import Image from "next/image";
import Link from "next/link";

import type { NewsPost } from "@/data/news";
import { cn } from "@/lib/utils";

export type NewsPostCardProps = {
  post: NewsPost;
  className?: string;
  imageClassName?: string;
};

export function NewsPostCard({
  post,
  className,
  imageClassName,
}: NewsPostCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <Link
        href={`/news/${post.slug}`}
        className="grid gap-5 sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-8 lg:gap-10"
      >
        <div
          className={cn(
            "relative aspect-square w-full max-w-[200px] shrink-0 overflow-hidden",
            "sm:max-w-[200px] aspect-3/4",
            imageClassName,
          )}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes={"(max-width: 640px) 42vw, 200px"}
            />
          ) : null}
        </div>
        <div className="flex min-w-0 min-h-0 flex-col justify-start pr-0">
          <p
            className={cn(
              "text-xs font-light uppercase leading-none text-white sm:text-xs",
            )}
          >
            {post.dateLabel}
          </p>
          <h2
            className={cn(
              "mt-2.5 max-w-prose font-display text-lg font-medium text-white sm:mt-3 sm:text-xl leading-none",
              "lg:max-w-[20rem]",
            )}
          >
            {post.title}
          </h2>
          <p
            className={cn(
              "mt-2.5 line-clamp-3 text-sm font-light leading-relaxed text-white sm:mt-20",
            )}
          >
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
