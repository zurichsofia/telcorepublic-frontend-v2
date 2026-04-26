"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import type { NewsPost } from "@/data/news";
import { cn } from "@/lib/utils";

import { NewsPostCard } from "./news-post-card";

const PAGE_SIZE = 8;

/** Even indices → left column, odd → right; stable when loading more (row-major order). */
function splitRowMajor(shown: readonly NewsPost[]): {
  left: NewsPost[];
  right: NewsPost[];
} {
  const left: NewsPost[] = [];
  const right: NewsPost[] = [];
  shown.forEach((post, i) => {
    (i % 2 === 0 ? left : right).push(post);
  });
  return { left, right };
}

export type NewsList = {
  hero: ReactNode;
  first?: NewsPost;
  second?: NewsPost;
  /** Posts after the two lead stories (chronological). */
  gridPosts: readonly NewsPost[];
};

/**
 * News hub layout: hero + lower stack in the left rail, two lead stories then
 * the rest (lg+). Grid posts use row-major pairing (0|1, 2|3, …) so reading
 * order matches `gridPosts` and load-more never moves a card to the other column.
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

  const { left: leftRail, right: rightRail } = useMemo(
    () => splitRowMajor(shown),
    [shown],
  );

  /** Two lead stories: explicit grid; grid posts fill row-major from row 3. */
  const hasTwoLeads = Boolean(first && second);

  const loadMore =
    hasMore ? (
      <div className="mt-32 flex flex-col items-center gap-8 sm:mt-36 sm:gap-9 lg:mt-40">
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
      <div className="flex flex-col gap-28 sm:gap-32 lg:hidden">
        {hero}
        {first ? <NewsPostCard post={first} /> : null}
        {second ? <NewsPostCard post={second} /> : null}
        {shown.map((post) => (
          <NewsPostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Wide: two-lead grid + row-major grid posts from row 3 */}
      {hasTwoLeads ? (
        <div
          className={cn(
            "hidden lg:grid",
            "lg:grid-cols-2",
            "lg:items-start lg:gap-x-12 lg:gap-y-40 xl:gap-x-20 xl:gap-y-48",
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
          {shown.map((post, i) => (
            <div
              key={post.slug}
              className="min-w-0"
              style={{
                gridColumn: 1 + (i % 2),
                gridRow: 3 + Math.floor(i / 2),
              }}
            >
              <NewsPostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "hidden gap-20 lg:grid",
            "lg:grid-cols-2",
            "lg:items-start lg:gap-x-12 lg:gap-y-40 xl:gap-x-20 xl:gap-y-48",
          )}
        >
          <div className="flex min-w-0 flex-col gap-32 sm:gap-36 lg:gap-40">
            {hero}
            {leftRail.map((post) => (
              <NewsPostCard key={post.slug} post={post} />
            ))}
          </div>
            <div
            className={cn(
              "flex min-w-0 flex-col gap-32 sm:gap-36 lg:gap-40",
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
