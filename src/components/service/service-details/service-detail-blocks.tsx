import { CustomResearchRadialDiagram } from "@/components/service/service-details/editorial/custom-research-radial-diagram";
import { InlineList } from "@/components/service/service-details/inline-list";
import { HighlightsGrid } from "@/components/service/service-details/highlights-grid";
import { PillarsSection } from "@/components/service/service-details/pillars-section";
import {
  serviceDetailBody,
  serviceDetailColumn,
  serviceDetailHeading,
  serviceDetailStack,
} from "@/components/service/service-details/service-detail-styles";
import type { ServiceContentBlock } from "@/data/service-content-types";
import { cn } from "@/lib/utils";

export type ServiceDetailBlockProps = {
  block: ServiceContentBlock;
};

export function ServiceDetailBlock({ block }: ServiceDetailBlockProps) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={cn(serviceDetailColumn, serviceDetailBody)}>
          {block.text}
        </p>
      );

    case "paragraphGroup":
      return (
        <div className={cn(serviceDetailColumn, serviceDetailStack, "max-w-[70rem]")}>
          {block.subheading ? (
            <h2 className={serviceDetailHeading}>{block.subheading}</h2>
          ) : null}
          {block.paragraphs.map((text, i) => (
            <p key={i} className={serviceDetailBody}>
              {text}
            </p>
          ))}
        </div>
      );

    case "pillars":
      return (
        <PillarsSection
          items={block.items.map((item) => ({
            label: item.label,
            text: item.text,
          }))}
        />
      );

    case "highlights":
      return (
        <HighlightsGrid heading={block.heading} items={block.items} />
      );

    case "inlineList":
      return <InlineList heading={block.heading} items={block.items} />;

    case "customResearchDiagram":
      return (
        <section className="mx-auto max-w-4xl px-5 sm:px-8">
          <CustomResearchRadialDiagram />
        </section>
      );

    default: {
      const _never: never = block;
      return _never;
    }
  }
}
