import { htmlToBlocks } from "@portabletext/block-tools";
import type { ArraySchemaType } from "@sanity/types";
import mammoth from "mammoth";

function parseHtml(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

export async function docxToPortableText(
  arrayBuffer: ArrayBuffer,
  schemaType: ArraySchemaType,
) {
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const blocks = htmlToBlocks(result.value, schemaType, {
    parseHtml,
  });

  return { blocks };
}
