"use client";

import type { ServiceContentBlock } from "@/data/services";

import { EditorialOffersGroup } from "./editorial-offers";
import { EditorialParagraph } from "./editorial-paragraph";
import { EditorialRoleCallouts } from "./editorial-role-callouts";
import { EditorialSimpleList } from "./editorial-simple-list";
import { EditorialSubheading } from "./editorial-subheading";
import { EditorialTagList } from "./editorial-tag-list";

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
            const paragraphIndex = blocks
              .slice(0, i)
              .filter((b) => b.type === "paragraph").length;
            const variant = paragraphIndex % 2 === 0 ? "a" : "b";
            return (
              <EditorialParagraph key={key} text={block.text} variant={variant} />
            );
          }
          case "subheading":
            return <EditorialSubheading key={key} text={block.text} />;
          case "roleCallouts":
            return <EditorialRoleCallouts key={key} items={block.items} />;
          case "tagList":
            return (
              <EditorialTagList
                key={key}
                heading={block.heading}
                tags={block.tags}
              />
            );
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
