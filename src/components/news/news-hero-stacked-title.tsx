import { cn } from "@/lib/utils";

export type NewsHeroStackedTitleProps = {
  className?: string;
  id?: string;
};

/**
 * “BLOG / NEWS” lockup: last row is “S” with the subhead to the right, vertically centered to S
 * “Latest News” on one line, “and updates” below, text centered in that column
 */
export function NewsHeroStackedTitle({
  className,
  id = "news-hero-title",
}: NewsHeroStackedTitleProps) {
  return (
    <div className={cn("select-none", className)}>
      <h1
        id={id}
        className="font-display text-[clamp(2.5rem,9.5vw,6.8rem)] font-medium leading-[0.82] tracking-[-0.03em] text-white"
        aria-label="Blog news, Latest news and updates"
      >
        <span className="block w-max">BL</span>
        <span className="block w-max pl-10">
          OG
          {"–"}
        </span>
        <span className="block w-max">NEW</span>
        <span className="mt-[0.04em] block w-full min-w-0 max-w-3xl">
          <span className="inline-flex w-full min-w-0 max-w-3xl items-center ">
            <span className="w-max shrink-0 text-[1em] leading-[0.82]">S</span>
            <span
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center text-center",
                "text-lg font-light tracking-normal",
                "text-white font-features-[normal]",
                "sm:max-w-52 sm:text-xl font-semibold",
              )}
            >
              <span className="block w-full">Latest News</span>
              <span className="pl-16 block w-full -mt-2.5">and updates</span>
            </span>
          </span>
        </span>
      </h1>
    </div>
  );
}
