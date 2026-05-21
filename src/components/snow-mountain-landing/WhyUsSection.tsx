import { HOME_WHY_SNAP_ID } from "@/components/common/document-scroll-snap";
import { cn } from "@/lib/utils";

const WHY_CHAPTERS = [
  {
    title: "Decades of Industry Experience",
    paragraphs: [
      "We have worked for leading global analyst research firms, such as Gartner, for decades. We have worked in the industry and followed its market evolution since the 1990s.",
    ],
  },
  {
    title: "Personalized, Responsive and Collaborative",
    paragraphs: [
      "Our services are personalized and flexible, at an attractive price/performance ratio.",
    ],
  },
  {
    title: "Comprehensive Insights",
    paragraphs: [
      "We have supported hundreds of global operators, vendors, investors and tech startups.",
    ],
  },
  {
    title: "Reliable Methodology",
    paragraphs: [
      "We have developed industry models, benchmarks and best practices for users and suppliers to support digital transformation and change management.",
    ],
  },
  {
    title: "Objective, Unbiased, Fact-based",
    paragraphs: [
      "Our mission is to provide unbiased, fact-based and in-depth insights in conjunction with strategic advice.",
    ],
  },
  {
    title: "Extensive Network",
    paragraphs: [
      "Industry leaders rely on our insights and advice. We maintain a strong Senior Executive and C-Level network on a global basis.",
    ],
  },
] as const;

function WhyChapter({
  title,
  paragraphs,
  variant,
}: {
  title: string;
  paragraphs: readonly string[];
  variant: "a" | "b";
}) {
  const isA = variant === "a";
  return (
    <div
      className={cn(
        "flex w-full max-w-full flex-col justify-center overflow-x-clip",
        isA
          ? "pl-5 pr-4 md:pl-12 md:pr-8 lg:pl-24 lg:pr-12"
          : "pl-5 pr-4 md:pl-16 md:pr-8 lg:pl-28 lg:pr-16",
      )}
    >
      <div
        className={cn(
          "w-full max-w-2xl ",
          !isA && "ml-auto text-right",
        )}
      >
        <h3
          className={cn(
            "text-pretty font-sans text-xl font-medium leading-snug tracking-tight text-telco-red sm:text-2xl lg:text-3xl",
            !isA && "ml-auto max-w-2xl",
          )}
        >
          {title}
        </h3>
        <div
          className={cn(
            "space-y-4 text-pretty font-sans text-base font-light leading-tight tracking-tight text-black lg:text-xl",
            !isA && "ml-auto",
          )}
        >
          {paragraphs.map((text, j) => (
            <p key={`${title}-${j}`}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** “Why Telco Republic” — in-flow chapters (not sticky). */
export function WhyUsSection() {
  return (
    <section
      id="why-telco-republic"
      className="relative isolate w-full overflow-x-clip bg-white pb-8"
      aria-labelledby="home-why-heading"
    >
      <div
        id={HOME_WHY_SNAP_ID}
        className="flex w-full flex-col justify-center"
      >
        <div> </div>
      </div>

      <div
        className="relative flex w-full flex-col space-y-16 md:space-y-60"
        aria-label="Why Telco Republic"
      >
        {WHY_CHAPTERS.map((chapter, i) => (
          <WhyChapter
            key={chapter.title}
            title={chapter.title}
            paragraphs={chapter.paragraphs}
            variant={i % 2 === 0 ? "a" : "b"}
          />
        ))}
      </div>
    </section>
  );
}
