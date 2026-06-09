/**
 * Shared structured copy for service listings and detail pages.
 */

export type ServiceContentBlock =
  /** Multiple paragraphs shown as one block with tighter vertical rhythm than separate entries. */
  | {
    type: "paragraphGroup";
    /** Optional heading rendered above paragraphs with the same tight spacing as within the group. */
    subheading?: string;
    paragraphs: readonly string[];
  }
  | { type: "paragraph"; text: string; }
  /** Centered dot pillars with optional label above each line. */
  | {
    type: "pillars";
    items: readonly { label?: string; text: string; }[];
  }
  /** Named highlights — e.g. tools, capabilities, or approach qualities. */
  | {
    type: "highlights";
    heading?: string;
    items: readonly { name: string; description: string; }[];
  }
  | {
    type: "inlineList";
    heading?: string;
    items: readonly string[];
  }
  | {
    type: "diagram";
    src: string;
    alt: string;
    width: number;
    height: number;
  };

export type ServiceRecord = {
  readonly slug: string;
  readonly title: string;
  readonly desc: string;
  readonly descShort: string;
  /** Optional line under the detail title (`desc`); not part of `content`. */
  readonly intro?: string;
  readonly content: readonly ServiceContentBlock[];
};
