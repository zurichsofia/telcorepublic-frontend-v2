import { ContactPageContent } from "@/components/contact/contact-page-content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata.contact;

export default function ContactPage() {
  return <ContactPageContent />;
}
