import type { Metadata } from "next";

import { ContactPageContent } from "@/components/contact/contact-page-content";

export const metadata: Metadata = {
  title: "Contact | Telcorepublic Research",
  description:
    "Reach Telco Republic for research inquiries, subscriptions, and custom telecom OSS and BSS coverage.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
