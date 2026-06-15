import type { Metadata } from "next";

export const SITE_NAME = "Telco Republic";

export function buildPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`;
}

export const defaultMetadata: Metadata = {
  title: `${SITE_NAME} | Market research and advisory telecom software market`,
  description:
    "We are the go-to, thought-provoking market research and advisory firm for the new telecom software market.",
};

export const pageMetadata = {
  home: defaultMetadata,
  services: {
    title: buildPageTitle("Services"),
    description:
      "Always be up-to-speed with timely insights and real-time inquiry access to industry experts.",
  },
  news: {
    title: buildPageTitle("News"),
    description:
      "Latest news, research updates, and industry perspectives from Telco Republic.",
  },
  contact: {
    title: buildPageTitle("Contact"),
    description:
      "Reach Telco Republic for research inquiries, subscriptions, and custom telecom OSS and BSS coverage.",
  },
  howToWorkWithUs: {
    title: buildPageTitle("How To Work With Us"),
    description:
      "Flexible engagement models including on-demand consultation, recurring consultation, strategy sessions, and subscription tiers.",
  },
  operationTeam: {
    title: buildPageTitle("Operation Team"),
    description:
      "Martina Kurth leverages a well-established contact network with CSPs, vendors, standard bodies, start-ups and investors in the global telco industry.",
  },
  expertise: {
    title: buildPageTitle("Expertise"),
    description:
      "We have tracked the telecom industry for decades. Our services are personalized and flexible, at an attractive price/performance ratio.",
  },
  whoWeServe: {
    title: buildPageTitle("Who We Serve"),
    description:
      "Nimble, leading-edge advisory services for ISVs, CSPs, NEPs, OTTs, hyperscalers, investors, and startups across the telecom ecosystem.",
  },
  clients: {
    title: buildPageTitle("Our Clients"),
    description: "Telco Republic works with leading telecom vendors and cloud providers worldwide. See the organizations we are privileged to serve.",
  },
  studio: {
    title: buildPageTitle("Studio"),
    robots: { index: false, follow: false },
  },
} as const satisfies Record<string, Metadata>;

export function getServicePageMetadata(service: {
  title: string;
  desc: string;
}): Metadata {
  return {
    title: buildPageTitle(service.title),
    description: service.desc,
  };
}

export function getNewsArticlePageMetadata(post: {
  title: string;
  metaDescription?: string | null;
  excerpt: string;
}): Metadata {
  return {
    title: buildPageTitle(post.title),
    description: post.metaDescription || post.excerpt,
  };
}
