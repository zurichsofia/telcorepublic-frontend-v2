import { AboutPageContent } from "@/components/about/about-page-content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata.about;

export default function AboutPage() {
  return <AboutPageContent />;
}
