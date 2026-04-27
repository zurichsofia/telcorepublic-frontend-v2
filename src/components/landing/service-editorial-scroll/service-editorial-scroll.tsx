"use client";

import type { ServiceContentBlock } from "@/data/service-content-types";
import { Fragment } from "react";

import { EditorialOffersGroup } from "./editorial-offers";
import { EditorialParagraph } from "./editorial-paragraph";
import { EditorialRoleCallouts } from "./editorial-role-callouts";
import { EditorialSimpleList } from "./editorial-simple-list";
import { EditorialSubheading } from "./editorial-subheading";

function paragraphOrdinalBefore(
  blocks: readonly ServiceContentBlock[],
  index: number,
): number {
  let n = 0;
  for (let k = 0; k < index; k++) {
    const b = blocks[k];
    if (b.type === "paragraph") n += 1;
    else if (b.type === "paragraphGroup") n += b.paragraphs.length;
  }
  return n;
}

export type ServiceEditorialScrollProps = {
  blocks: readonly ServiceContentBlock[];
  storyKey: string;
};

export function ServiceEditorialScroll({
  blocks,
  storyKey,
}: ServiceEditorialScrollProps) {
  return (
    <div className="relative w-full" aria-label="Service narrative">
      {blocks.map((block, i) => {
        const key = `${storyKey}-${block.type}-${i}`;
        switch (block.type) {
          case "paragraph": {
            const paragraphIndex = paragraphOrdinalBefore(blocks, i);
            const variant = paragraphIndex % 2 === 0 ? "a" : "b";
            return (
              <EditorialParagraph key={key} text={block.text} variant={variant} />
            );
          }
          case "paragraphGroup":
            return (
              <Fragment key={key}>
                {block.subheading ? (
                  <EditorialSubheading key={`${key}-subheading`} text={block.subheading} />
                ) : null}
                {block.paragraphs.map((text, j) => {
                  const paragraphIndex = paragraphOrdinalBefore(blocks, i) + j;
                  const variant = paragraphIndex % 2 === 0 ? "a" : "b";
                  return (
                    <EditorialParagraph
                      key={`${key}-${j}`}
                      text={text}
                      variant={variant}
                    />
                  );
                })}
              </Fragment>
            );
          case "subheading":
            return <EditorialSubheading key={key} text={block.text} />;
          case "pillarLines":
            return (
              <EditorialParagraph key={key} text={block.lines.join(" ")} variant="a" />
            );
          case "roleCallouts":
            return <EditorialRoleCallouts key={key} items={block.items} />;
          case "offers":
            return (
              <EditorialOffersGroup
                key={key}
                heading={block.heading}
                items={block.items}
              />
            );
          case "simpleList":
            return (
              <EditorialSimpleList
                key={key}
                heading={block.heading}
                items={block.items}
              />
            );
          default: {
            const _exhaustive: never = block;
            return _exhaustive;
          }
        }
      })}
    </div>
  );
}
