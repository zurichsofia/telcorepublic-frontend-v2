import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getCliClient } from "sanity/cli";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

/** @typedef {{ type: string; text?: string; level?: number; ordered?: boolean; items?: string[]; src?: string }} ContentBlock */
/** @typedef {{ slug: string; sourceUrl: string; title: string; excerpt: string; coverImage?: string; publishedAt: string; metaDescription: string; content: ContentBlock[]; authors: string | null }} RawPost */

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function headingStyle(level = 4) {
  if (level <= 2) return "h2";
  if (level <= 4) return "h3";
  return "h4";
}

function textBlock(text, style = "normal", listItem, level) {
  /** @type {Record<string, unknown>} */
  const block = {
    _type: "block",
    _key: key(),
    style,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level ?? 1;
  }
  return block;
}

/**
 * @param {ContentBlock[]} content
 * @param {Map<string, string>} imageRefs
 */
function blocksToPortableText(content, imageRefs) {
  /** @type {Record<string, unknown>[]} */
  const result = [];
  for (const block of content) {
    if (block.type === "paragraph" && block.text) {
      result.push(textBlock(block.text, "normal"));
    } else if (block.type === "heading" && block.text) {
      result.push(textBlock(block.text, headingStyle(block.level)));
    } else if (block.type === "list" && block.items?.length) {
      const listItem = block.ordered ? "number" : "bullet";
      for (const item of block.items) {
        result.push(textBlock(item, "normal", listItem, 1));
      }
    } else if (block.type === "image" && block.src) {
      const ref = imageRefs.get(block.src);
      if (ref) {
        result.push({
          _type: "image",
          _key: key(),
          asset: { _type: "reference", _ref: ref },
        });
      }
    }
  }
  return result;
}

/**
 * @param {import('@sanity/client').SanityClient} client
 * @param {string} publicPath
 * @param {Map<string, string>} cache
 */
async function uploadImage(client, publicPath, cache) {
  if (!publicPath) return null;
  if (cache.has(publicPath)) return cache.get(publicPath);

  const filePath = path.join(publicDir, publicPath.replace(/^\//, ""));
  const asset = await client.assets.upload(
    "image",
    createReadStream(filePath),
    { filename: path.basename(filePath) },
  );
  cache.set(publicPath, asset._id);
  return asset._id;
}

async function importNews() {
  const client = getCliClient({ apiVersion: "2026-05-27" });
  const jsonPath = path.join(rootDir, "src/data/news-posts.json");
  const raw = JSON.parse(await readFile(jsonPath, "utf8"));
  /** @type {RawPost[]} */
  const posts = raw;

  /** @type {Map<string, string>} */
  const imageCache = new Map();

  console.log(`Importing ${posts.length} news articles…`);

  for (const post of posts) {
    const imageRefs = new Map();

    for (const block of post.content) {
      if (block.type === "image" && block.src) {
        const ref = await uploadImage(client, block.src, imageCache);
        if (ref) imageRefs.set(block.src, ref);
      }
    }

    const coverRef = post.coverImage
      ? await uploadImage(client, post.coverImage, imageCache)
      : null;

    const doc = {
      _id: `newsArticle-${post.slug}`,
      _type: "newsArticle",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      authors: post.authors,
      metaDescription: post.metaDescription,
      sourceUrl: post.sourceUrl,
      ...(coverRef
        ? {
            coverImage: {
              _type: "image",
              asset: { _type: "reference", _ref: coverRef },
            },
          }
        : {}),
      body: blocksToPortableText(post.content, imageRefs),
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${post.slug}`);
  }

  console.log("Done. All articles imported as published documents.");
}

importNews().catch((error) => {
  console.error(error);
  process.exit(1);
});
