import type { StructureBuilder } from "sanity/structure";

/**
 * Studio desk: jump straight into News Articles.
 * This removes the extra "Content" root navigation column.
 */
export const structure = (S: StructureBuilder) =>
  S.documentTypeList("newsArticle")
    .title("News Articles")
    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]);

