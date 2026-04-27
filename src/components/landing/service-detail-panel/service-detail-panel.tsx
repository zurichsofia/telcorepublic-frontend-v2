"use client";

import { CustomResearchRadialDiagram } from "@/components/landing/service-editorial-panel/custom-research-radial-diagram";
import { EditorialInlineList } from "@/components/landing/service-editorial-panel/editorial-inline-list";
import { EditorialPillarsSection } from "@/components/landing/service-editorial-panel/editorial-pillars-section";
import { SERVICE_DETAIL_INTRO_SNAP_ID } from "@/components/common/document-scroll-snap";
import type { ServiceContentBlock } from "@/data/service-content-types";
import type { ServiceEntry } from "@/data/services";
import { cn } from "@/lib/utils";

/** Vertical rhythm between major blocks on `/services/[slug]` (Tailwind gap scale). */
const detailBlockStack =
  "flex w-full flex-col gap-y-28 md:gap-y-36 lg:gap-y-44";

/**
 * Content under the video hero on `/services/[slug]`.
 *
 * Copy: `service.desc`, optional `intro`, then `service.content` blocks in order
 * (`pillarLines`, `paragraph`, `offers`, … — see `services-v2.ts`).
 */

// --- Body: one block type → one piece of UI ---

function ServiceDetailContentBlocks({
  slug,
  body,
}: {
  slug: string;
  body: readonly ServiceContentBlock[];
}) {
  return (
    <div className={cn("w-full", detailBlockStack)}>
      {body.map((block, i) => {
        const key = `${slug}-${block.type}-${i}`;
        const blockClass = `service-detail-block service-detail-block--${block.type}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={key}
                className={cn(
                  blockClass,
                  "mx-auto max-w-3xl px-5 text-pretty font-sans text-sm font-light leading-relaxed text-black/80 sm:text-base text-center",
                )}
              >
                {block.text}
              </p>
            );
          case "paragraphGroup":
            return (
              <div
                key={key}
                className={cn(
                  blockClass,
                  "mx-auto flex w-full max-w-3xl flex-col gap-y-6 px-5 text-center md:gap-y-7 lg:gap-y-8",
                )}
              >
                {block.subheading ? (
                  <h3
                    className="text-pretty font-sans text-lg font-medium leading-snug tracking-tight text-telco-red sm:text-xl"
                  >
                    {block.subheading}
                  </h3>
                ) : null}
                {block.paragraphs.map((text, j) => (
                  <p
                    key={j}
                    className="text-pretty font-sans text-sm font-light leading-relaxed text-black/80 sm:text-base"
                  >
                    {text}
                  </p>
                ))}
              </div>
            );
          case "subheading":
            return (
              <h3
                key={key}
                className={cn(
                  blockClass,
                  "mx-auto max-w-3xl px-5 text-center font-sans text-lg font-medium leading-snug tracking-tight text-telco-red sm:text-xl",
                )}
              >
                {block.text}
              </h3>
            );
          case "pillarLines":
            return (
              <EditorialPillarsSection
                key={key}
                className={blockClass}
                items={block.lines.map((text) => ({ text }))}
              />
            );
          case "roleCallouts":
            return (
              <EditorialPillarsSection
                key={key}
                className={blockClass}
                items={block.items.map((it) => ({
                  label: it.role,
                  text: it.text,
                }))}
              />
            );
          case "offers":
            return (
              <section key={key} className={cn(blockClass, "w-full")}>
                <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:max-w-5xl md:-translate-x-3 lg:-translate-x-5">
                  <div className="w-full space-y-28 md:space-y-36">
                    {block.items.map((item) => (
                      <div
                        key={item.name}
                        className="grid w-full min-w-0 grid-cols-1 gap-10 md:grid-cols-[minmax(0,12fr)_minmax(0,13fr)] md:items-start md:gap-x-8 md:gap-y-2 lg:gap-x-12"
                      >
                        <h4 className="min-w-0 w-full text-left font-sans text-2xl leading-tight tracking-tight text-black md:text-right md:text-4xl">
                          {item.name}
                        </h4>
                        <p className="min-w-0 w-full max-w-none text-left font-sans text-sm font-light leading-relaxed text-black/80 md:text-base">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          case "simpleList": {
            if (block.items.length === 3) {
              return (
                <div
                  key={key}
                  className={cn(
                    blockClass,
                    "service-detail-block--simpleList-pillars",
                    "w-full",
                  )}
                >
                  {block.heading ? (
                    <h3 className="mx-auto max-w-2xl px-5 pb-6 text-center font-sans text-lg font-medium leading-snug text-telco-red sm:text-xl md:pb-8">
                      {block.heading}
                    </h3>
                  ) : null}
                  <EditorialPillarsSection
                    items={block.items.map((text) => ({ text }))}
                  />
                </div>
              );
            }
            return (
              <EditorialInlineList
                key={key}
                className={cn(blockClass, "service-detail-block--simpleList-inline")}
                heading={block.heading}
                items={block.items}
              />
            );
          }
          default: {
            const _never: never = block;
            return _never;
          }
        }
      })}

      {slug === "custom-research" ? (
        <section className="service-detail-block service-detail-block--customResearchDiagram px-5 sm:px-8">
          <CustomResearchRadialDiagram />
        </section>
      ) : null}
    </div>
  );
}

// --- Page section ---

export type ServiceDetailPanelProps = {
  service: ServiceEntry;
};

export function ServiceDetailPanel({ service }: ServiceDetailPanelProps) {
  return (
    <div className="relative w-full bg-white pb-28 text-black md:pb-36 lg:pb-44">
      <div className={cn("w-full", detailBlockStack)}>
        <section
          id={SERVICE_DETAIL_INTRO_SNAP_ID}
          className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-center px-5 pt-28 pb-16 text-center sm:px-8 lg:max-w-4xl"
        >
          <h2 className="text-pretty font-sans text-xl font-normal leading-snug tracking-tight text-telco-red sm:text-2xl md:text-3xl lg:text-[2rem] lg:leading-tight">
            {service.desc}
          </h2>
          {service.intro ? (
            <p className="mx-auto mt-12 max-w-2xl text-pretty font-sans text-base font-light leading-relaxed text-telco-red sm:text-base md:mt-16">
              {service.intro}
            </p>
          ) : null}
        </section>

        <ServiceDetailContentBlocks slug={service.slug} body={service.content} />
      </div>
    </div>
  );
}
