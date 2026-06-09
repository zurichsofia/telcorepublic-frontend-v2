import { Fragment } from "react";

import {
  serviceDetailColumn,
  serviceDetailHeading,
  serviceDetailHighlightBody,
  serviceDetailHighlightsBodyCell,
  serviceDetailHighlightTitle,
  serviceDetailHighlightsStack,
  serviceDetailHighlightsTitleCell,
  serviceDetailStack,
} from "@/components/service/service-details/service-detail-styles";
import { cn } from "@/lib/utils";

export type HighlightItem = {
  name: string;
  description: string;
};

export type HighlightsGridProps = {
  heading?: string;
  items: readonly HighlightItem[];
};

export function HighlightsGrid({ heading, items }: HighlightsGridProps) {
  return (
    <section className={serviceDetailStack}>
      <div className={serviceDetailHighlightsStack}>
        {items.map((item) => (
          <Fragment key={item.name}>
            <h3
              className={cn(
                serviceDetailHighlightTitle,
                serviceDetailHighlightsTitleCell,
              )}
            >
              {item.name}
            </h3>
            <p
              className={cn(
                serviceDetailHighlightBody,
                serviceDetailHighlightsBodyCell,
              )}
            >
              {item.description}
            </p>
          </Fragment>
        ))}
      </div>
    </section >
  );
}
