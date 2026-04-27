/**
 * Shared structured copy for service listings and detail pages.
 */

export type ServiceContentBlock =
  | { type: "paragraph"; text: string; }
  /** Multiple paragraphs shown as one block with tighter vertical rhythm than separate `paragraph` entries. */
  | {
    type: "paragraphGroup";
    /** Optional heading rendered above paragraphs with the same tight spacing as within the group. */
    subheading?: string;
    paragraphs: readonly string[];
  }
  | { type: "subheading"; text: string; }
  /** Short lines under `intro`, same layout as dotted pillars on the detail page. */
  | { type: "pillarLines"; lines: readonly string[]; }
  | {
    type: "roleCallouts";
    items: readonly { role: string; text: string; }[];
  }
  | {
    type: "offers";
    heading?: string;
    items: readonly { name: string; description: string; }[];
  }
  | { type: "simpleList"; heading?: string; items: readonly string[]; };

export type ServiceRecord = {
  readonly slug: string;
  readonly title: string;
  readonly desc: string;
  readonly descShort: string;
  /** Optional line under the detail title (`desc`); not part of `content`. */
  readonly intro?: string;
  readonly content: readonly ServiceContentBlock[];
};
