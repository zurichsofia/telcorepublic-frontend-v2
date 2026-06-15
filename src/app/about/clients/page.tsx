import { ClientsPageContent } from "@/components/about/clients-page-content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata.clients;

export default function ClientsPage() {
  return <ClientsPageContent />;
}
