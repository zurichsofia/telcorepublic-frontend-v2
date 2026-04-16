export const services = [
  {
    slug: "disrupter-quadrants",
    title: "Disrupter Quadrants",
    desc: "Evaluate and compare vendors that specialize in innovation and disruption in emerging next-generation telecom operations and business support systems.",
  },
  {
    slug: "competitive-positioning",
    title: "Competitive Positioning",
    desc: "Differentiate yourself with SWOTs, best practices, benchmarking, whitepapers and roadmap evaluations.",
  },
  {
    slug: "go-to-market",
    title: "Go-To-Market",
    desc: "Refine your strategy with workshops, lead generation, RFP/RFI support, partner matchmaking, inquiry support and briefings.",
  },
  {
    slug: "market-assessment",
    title: "Market Assessment",
    desc: "Advance your business with addressable market insights, market entry evaluations, market segmentation and emerging vendors insights.",
  },
  {
    slug: "custom-research",
    title: "Custom Research",
    desc: "Gain in-depth insights tailored toward your individual requirements with our personalized custom research services.",
  },
  {
    slug: "subscription",
    title: "Subscription",
    desc: "Always be up-to-speed with recurring insights and real-time access to industry experts.",
  },
] as const;

export type ServiceEntry = (typeof services)[number];

export function getServiceBySlug(slug: string): ServiceEntry | undefined {
  return services.find((s) => s.slug === slug);
}

export function serviceIndexFromSlug(slug: string): number {
  return services.findIndex((s) => s.slug === slug);
}
