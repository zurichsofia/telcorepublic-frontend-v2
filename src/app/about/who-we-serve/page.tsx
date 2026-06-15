import { WhoWeServePageContent } from "@/components/about/who-we-serve-page-content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata.whoWeServe;

export default function WhoWeServePage() {
  return <WhoWeServePageContent />;
}
