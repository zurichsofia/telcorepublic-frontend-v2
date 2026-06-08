import type { Metadata } from "next";

import { pageMetadata } from "@/lib/page-metadata";

import StudioPageClient from "./studio-page-client";

export const metadata: Metadata = pageMetadata.studio;

export default function StudioPage() {
  return <StudioPageClient />;
}
