import { EditorialInlineList } from "@/components/landing/service-editorial-panel/editorial-inline-list";
import { EditorialPillarsSection } from "@/components/landing/service-editorial-panel/editorial-pillars-section";
import type { ServiceContentBlock } from "@/data/services";

export function ServiceLandingContentBlocks({
  blocks,
  withShell = true,
}: {
  blocks: readonly ServiceContentBlock[];
  /** When false, only inner block spacing is rendered (e.g. after `intro` in the services list). */
  withShell?: boolean;
}) {
  const inner = (
    <>
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key} className="text-pretty">
                {block.text}
              </p>
            );
          case "paragraphGroup":
            return (
              <div key={key} className="space-y-4 text-pretty md:space-y-5">
                {block.subheading ? (
                  <h4 className="font-display text-base font-normal tracking-tight text-black/88">
                    {block.subheading}
                  </h4>
                ) : null}
                {block.paragraphs.map((text, j) => (
                  <p key={j}>{text}</p>
                ))}
              </div>
            );
          case "subheading":
            return (
              <h4
                key={key}
                className="font-display text-base font-normal tracking-tight text-black/88"
              >
                {block.text}
              </h4>
            );
          case "pillarLines":
            return (
              <p key={key} className="text-pretty">
                {block.lines.join(" ")}
              </p>
            );
          case "roleCallouts":
            return (
              <EditorialPillarsSection
                key={key}
                className="!mx-0 max-w-none !space-y-12 px-0 py-0 md:!space-y-14"
                items={block.items.map((it) => ({
                  label: it.role,
                  text: it.text,
                }))}
              />
            );
          case "offers":
            return (
              <div key={key} className="space-y-6 md:space-y-8">
                {block.heading ? (
                  <h4 className="font-display text-base font-normal tracking-tight text-black/88">
                    {block.heading}
                  </h4>
                ) : null}
                <ul className="space-y-6 md:space-y-7">
                  {block.items.map((item) => (
                    <li key={item.name}>
                      <p className="font-medium text-black/85">{item.name}</p>
                      <p className="mt-2 text-pretty md:mt-2.5">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "simpleList": {
            if (block.items.length === 3) {
              return (
                <div key={key}>
                  {block.heading ? (
                    <h4 className="font-display mb-6 text-center text-base font-medium leading-snug text-(--color-telco-red) md:mb-8">
                      {block.heading}
                    </h4>
                  ) : null}
                  <EditorialPillarsSection
                    className="!mx-0 max-w-none !space-y-12 px-0 py-0 md:!space-y-14"
                    items={block.items.map((text) => ({ text }))}
                  />
                </div>
              );
            }
            return (
              <EditorialInlineList
                key={key}
                dense
                className="!mx-0 max-w-none px-0 py-0"
                heading={block.heading}
                items={block.items}
              />
            );
          }
          default: {
            const _exhaustive: never = block;
            return _exhaustive;
          }
        }
      })}
    </>
  );

  if (!withShell) {
    return <div className="space-y-12 md:space-y-14">{inner}</div>;
  }

  return (
    <div className="mt-10 max-w-2xl space-y-12 text-sm font-light leading-relaxed text-black/62 md:mt-12 md:space-y-14">
      {inner}
    </div>
  );
}
