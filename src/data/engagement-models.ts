export type EngagementModel = {
  name: string;
  description: readonly string[];
  callout?: string;
};

export const engagementModels = [
  {
    name: "On-Demand Consultation",
    description: [
      "Sessions from one hour to multiple hours to explore ideas, brainstorm, validate roadmaps, products or value propositions, obtain new insights, etc.",
    ],
    callout: "Hourly rates start at €300.",
  },
  {
    name: "Recurring Consultation",
    description: [
      "Dedicated recurring engagements for an agreed number of hours on a flexible schedule.",
    ],
    callout: "Recurring consultation requires a semi-annual or annual subscription.",
  },
  {
    name: "Strategy Sessions",
    description: [
      "Strategy Sessions are extended on-demand consultations.",
      "They are one- to multi-day sessions to explore ideas, brainstorm, validate roadmaps, products or value propositions, obtain new insights, etc.",
    ],
  },
  {
    name: "Subscription",
    description: [
      "Access to research notes, Disrupter Quintants, forecasts, market share reports, inquiries, press support, distribution rights of research notes and Disrupter Quintants, custom competitive positioning, sponsored executive roundtables and strategy sessions.",
    ],
  },
] as const satisfies readonly EngagementModel[];

export const engagementComparisonIntro =
  "Telco Republic offers three subscription tiers with multiple levels of discounts and add-ons.";

export const engagementModelColumns = [
  "Project-Based",
  "On-Demand Consultation",
  "Recurring Consultation",
  "Strategy Session",
  "Subscription",
] as const;

export type EngagementModelColumn = (typeof engagementModelColumns)[number];

export type EngagementComparisonRow = {
  service: string;
  included: Record<EngagementModelColumn, boolean>;
};

export const engagementComparisonRows = [
  {
    service: "Competitive Positioning",
    included: {
      "Project-Based": true,
      "On-Demand Consultation": true,
      "Recurring Consultation": true,
      "Strategy Session": true,
      Subscription: false,
    },
  },
  {
    service: "Go-to-Market",
    included: {
      "Project-Based": true,
      "On-Demand Consultation": true,
      "Recurring Consultation": true,
      "Strategy Session": true,
      Subscription: false,
    },
  },
  {
    service: "Market Assessment",
    included: {
      "Project-Based": true,
      "On-Demand Consultation": true,
      "Recurring Consultation": true,
      "Strategy Session": true,
      Subscription: false,
    },
  },
  {
    service: "Research Notes",
    included: {
      "Project-Based": false,
      "On-Demand Consultation": false,
      "Recurring Consultation": false,
      "Strategy Session": false,
      Subscription: true,
    },
  },
  {
    service: "Podcasts/Vodcasts",
    included: {
      "Project-Based": true,
      "On-Demand Consultation": false,
      "Recurring Consultation": false,
      "Strategy Session": false,
      Subscription: true,
    },
  },
  {
    service: "Executive Roundtables",
    included: {
      "Project-Based": true,
      "On-Demand Consultation": false,
      "Recurring Consultation": false,
      "Strategy Session": true,
      Subscription: true,
    },
  },
  {
    service: "Custom Research",
    included: {
      "Project-Based": true,
      "On-Demand Consultation": false,
      "Recurring Consultation": true,
      "Strategy Session": false,
      Subscription: true,
    },
  },
  {
    service: "Inquiries",
    included: {
      "Project-Based": false,
      "On-Demand Consultation": false,
      "Recurring Consultation": true,
      "Strategy Session": false,
      Subscription: true,
    },
  },
  {
    service: "Briefings",
    included: {
      "Project-Based": false,
      "On-Demand Consultation": false,
      "Recurring Consultation": false,
      "Strategy Session": false,
      Subscription: true,
    },
  },
  {
    service: "Press Support",
    included: {
      "Project-Based": false,
      "On-Demand Consultation": false,
      "Recurring Consultation": false,
      "Strategy Session": false,
      Subscription: true,
    },
  },
  {
    service: "Distribution Rights",
    included: {
      "Project-Based": true,
      "On-Demand Consultation": false,
      "Recurring Consultation": false,
      "Strategy Session": false,
      Subscription: true,
    },
  },
] as const satisfies readonly EngagementComparisonRow[];
