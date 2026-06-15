"use client";

import { ScrollLinkedChapter } from "@/components/common/scroll-linked-chapter";

type AudienceSegment = {
  name: string;
  description: string;
};

export function WhoWeServeAudienceSection({
  segments,
}: {
  segments: readonly AudienceSegment[];
}) {
  return (
    <section
      className="mx-auto flex max-w-7xl flex-col overflow-x-clip px-5 py-20 sm:px-8 md:py-32 lg:py-40"
      aria-label="Constituents we serve"
    >
      {segments.map((segment, index) => (
        <ScrollLinkedChapter
          key={segment.name}
          title={segment.name}
          paragraphs={[segment.description]}
          alignRight={index % 2 === 1}
        />
      ))}
    </section>
  );
}
