"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import type { NewsPost } from "@/data/news";
import { cn } from "@/lib/utils";

import { NewsPostCard } from "./news-post-card";

const PAGE_SIZE = 6;

export type NewsList = {
  hero: ReactNode;
  first?: NewsPost;
  second?: NewsPost;
  /** Posts after the two lead stories (chronological). */
  gridPosts: readonly NewsPost[];
};

/**
 * News hub layout: hero + lower stack in the left rail, two lead stories then
 * the rest in the right rail (50/50 from lg; each rail takes half of the
 * remaining posts).
 */
export function NewsList({
  hero,
  first,
  second,
  gridPosts,
}: NewsList) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = useMemo(() => gridPosts.slice(0, visible), [gridPosts, visible]);
  const hasMore = visible < gridPosts.length;

  const mid = Math.ceil(shown.length / 2);
  const leftRail = shown.slice(0, mid);
  const rightRail = shown.slice(mid);

  /** Two lead stories: grid rows so left-rail[0] shares a row with right-rail[0] (3rd card on the right). */
  const hasTwoLeads = Boolean(first && second);

  const loadMore =
    hasMore ? (
      <div className="mt-20 flex flex-col items-center gap-6 sm:mt-24 sm:gap-7 lg:mt-24">
        <button
          type="button"
          onClick={() =>
            setVisible((v) => Math.min(v + PAGE_SIZE, gridPosts.length))
          }
          className="text-xs font-light tracking-[0.45em] text-white transition hover:text-white/80 sm:text-xs cursor-pointer"
        >
          LOAD MORE
        </button>
      </div>
    ) : null;

  return (
    <>
      {/* Narrow: single column, chronological */}
      <div className="flex flex-col gap-14 lg:hidden">
        {hero}
        {first ? <NewsPostCard post={first} /> : null}
        {second ? <NewsPostCard post={second} /> : null}
        {shown.map((post) => (
          <NewsPostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Wide: grid rows align first left-rail card with third right-column card */}
      {hasTwoLeads ? (
        <div
          className={cn(
            "hidden lg:grid",
            "lg:grid-cols-2",
            "lg:items-start lg:gap-x-10 lg:gap-y-24 xl:gap-x-16 xl:gap-y-28",
          )}
        >
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">{hero}</div>
          <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            <NewsPostCard post={first!} />
          </div>
          <div
            className="min-w-0 lg:col-start-1 lg:row-start-2"
            aria-hidden
          />
          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            <NewsPostCard post={second!} />
          </div>
          {leftRail.map((post, i) => (
            <div
              key={post.slug}
              className="min-w-0"
              style={{ gridColumn: 1, gridRow: 3 + i }}
            >
              <NewsPostCard post={post} />
            </div>
          ))}
          {rightRail.map((post, i) => (
            <div
              key={post.slug}
              className="min-w-0"
              style={{ gridColumn: 2, gridRow: 3 + i }}
            >
              <NewsPostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "hidden gap-14 lg:grid",
            "lg:grid-cols-2",
            "lg:items-start lg:gap-x-10 lg:gap-y-24 xl:gap-x-16 xl:gap-y-28",
          )}
        >
          <div className="flex min-w-0 flex-col gap-20 sm:gap-24 lg:gap-28">
            {hero}
            {leftRail.map((post) => (
              <NewsPostCard key={post.slug} post={post} />
            ))}
          </div>
          <div
            className={cn(
              "flex min-w-0 flex-col gap-20 sm:gap-24 lg:gap-28",
              "lg:pl-2",
            )}
          >
            {first ? <NewsPostCard post={first} /> : null}
            {second ? <NewsPostCard post={second} /> : null}
            {rightRail.map((post) => (
              <NewsPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      {loadMore}
    </>
  );
}
