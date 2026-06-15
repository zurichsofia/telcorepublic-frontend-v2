import { AudienceSegmentGrid, type AudienceSegment } from "@/components/about/audience-segment-grid";

export function WhoWeServeAudienceSection({
  segments,
}: {
  segments: readonly AudienceSegment[];
}) {
  return (
    <section
      className="mx-auto max-w-7xl px-5 pb-20"
      aria-label="Constituents we serve"
    >
      <AudienceSegmentGrid segments={segments} />
    </section>
  );
}
