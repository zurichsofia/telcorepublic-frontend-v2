import type { ServiceContentBlock, ServiceRecord } from "./service-content-types";

export type { ServiceContentBlock } from "./service-content-types";

export const services = [
  {
    slug: "disrupter-quintants",
    title: "Disrupter Quintants",
    desc: "Evaluate and compare vendors that specialize in innovation and disruption in emerging next-generation telecom operations and business support systems.",
    descShort: "Compare vendors driving innovation in next-gen telecom operations and business support systems.",
    content: [
      {
        type: "paragraph",
        text: "Disrupter Quintants are available to clients of Telco Republic's subscription service. Individual Disrupter Quintants are available on request. Contact us for more information.",
      },
      {
        type: "pillars",
        items: [
          {
            label: "Telecom technology buyers",
            text: "Use the Telco Republic Disrupter Quintants to select the best vendor for your digital transformation journeys.",
          },
          {
            label: "Vendors",
            text: "Use the Telco Republic Disrupter Quintants to compare yourself to your peers and improve your market positioning.",
          },
        ],
      },
      {
        type: "inlineList",
        heading: "Disrupter Quintants cover four domains",
        items: [
          "Resource Orchestration",
          "Service Orchestration",
          "Customer Orchestration",
          "Monetization",
        ],
      },
      {
        type: "paragraphGroup",
        subheading: "What are the Telco Republic Disrupter Quintants?",
        paragraphs: [
          "The Disrupter Quintants assess vendors across five segments (quintants) and two dimensions (strategy and execution) to provide guidance to telecom providers and vendors how to navigate emerging markets and how to make the best technology buying decisions.",
          "Disrupter Quintants provide a deep dive into vendors' ability to disrupt the traditional operations support systems (OSS) and business support systems (BSS) markets by enabling telecom providers to transition from traditional OSS and BSS to next-generation infrastructures, composed of horizontally architected, cognitive, cloud-based operational and business infrastructure as well as monetization and customer management orchestration.",
          "Disrupter Quintants are based on a rigorous and in-depth selection, evaluation and analysis of leading and emerging vendors.",
        ],
      },
    ] as const satisfies readonly ServiceContentBlock[],
  },
  {
    slug: "subscription",
    title: "Subscription",
    desc: "Always be up-to-speed with recurring insights and real-time access to industry experts.",
    descShort: "Stay up to date with real-time insights and expert access.",
    intro: "We ensure that you are always up-to-speed.",
    content: [
      {
        type: "paragraph",
        text: "Our subscription service includes",
      },
      {
        type: "pillars",
        items: [
          {
            text: "Recurring Insights on Technologies, Users, Vendors and Industry Trends",
          },
          {
            text: "Decision Support on Technology Purchasing, Product Development and Corporate Strategy",
          },
          { text: "Real-Time, Unlimited Access to Industry Experts" },
        ],
      },
      {
        type: "paragraph",
        text: "Subscribers have full access to Telco Republic's research notes, including unlimited inquiries.",
      },
      {
        type: "inlineList",
        heading: "Research notes cover",
        items: [
          "Disrupter Quintants",
          "Five-Year Market Forecasts",
          "Vendor Market Share Reports",
          "Emerging and Disruptive Vendors",
          "Market Innovation Trends",
          "Technology Innovation and Disruption Radar",
          "Technology and Industry Predictions",
          "Executive Interviews",
          "Case Studies",
          "Best Practices",
          "Surveys",
          "Webinars",
          "Podcasts",
          "Custom Competitive Positioning",
          "Sponsored Executive Roundtables",
          "Strategy Sessions",
          "Press Support",
          "Distribution Rights",
        ],
      },
      {
        type: "paragraph",
        text: "Telco Republic offers three subscription tiers with multiple levels of discounts and add-ons.",
      },
    ] as const satisfies readonly ServiceContentBlock[],
  },
  {
    slug: "competitive-positioning",
    title: "Competitive Positioning",
    desc: "Differentiate yourself with SWOTs, best practices, benchmarking, whitepapers and roadmap evaluations.",
    descShort: "Differentiate with SWOTs, benchmarking, and roadmap insights.",
    intro: "We help you differentiate yourself against your competition.",
    content: [
      {
        type: "paragraph",
        text: "Improve your company's positioning with these tools",
      },
      {
        type: "highlights",
        items: [
          {
            name: "Industry Vendor Market Evaluation",
            description:
              "Gain actionable insights into the telecom vendor landscape, enabling you to make informed sourcing and partnership decisions. Telco Republic's deep market knowledge helps you identify best-fit vendors aligned with your strategic objectives.",
          },
          {
            name: "SWOTs",
            description:
              "By leveraging comprehensive SWOT analyses, you can clearly understand your strengths, weaknesses, opportunities and threats in the telecom sector. This empowers you to proactively address challenges and capitalize on market opportunities.",
          },
          {
            name: "Competitive Landscapes",
            description:
              "You receive detailed assessments of your competitive environment, highlighting key players, market trends and potential disrupters. These insights support strategic positioning and differentiation in a rapidly evolving industry.",
          },
          {
            name: "Best Practices",
            description:
              "Telco Republic provides you with industry-leading best practices, helping you optimize processes, improve efficiency and stay ahead of regulatory and technological changes. This guidance ensures that you implement proven strategies for sustained success.",
          },
          {
            name: "Operational Benchmarks",
            description:
              "You benefit from robust benchmarking data, allowing you to measure your operational performance against industry standards. This enables targeted improvements and drives operational excellence.",
          },
          {
            name: "Product Assessments",
            description:
              "Through objective product evaluations, you gain clarity on the strengths and limitations of telecom solutions available in the market. This supports smarter investment decisions and technology adoption.",
          },
          {
            name: "Roadmap Evaluations",
            description:
              "Telco Republic assists you in evaluating and refining your technology and business roadmaps, ensuring alignment with market trends and future-proofing your strategies. This guidance helps you prioritize initiatives for maximum impact.",
          },
          {
            name: "Operating Model Strategies",
            description:
              "You receive tailored operating model recommendations that enhance agility, scalability, and cost-effectiveness. Telco Republic's expertise ensures your organization is structured for optimal performance in a dynamic telecom landscape.",
          },
          {
            name: "Advice on Target Positioning",
            description:
              "You benefit from strategic advice on market positioning, enabling you to clearly define and communicate your value proposition. This strengthens your competitive stance and drives business growth.",
          },
        ],
      },
    ] as const satisfies readonly ServiceContentBlock[],
  },
  {
    slug: "go-to-market",
    title: "Go-To-Market",
    desc: "Refine your strategy with workshops, lead generation, RFP/RFI support, partner matchmaking, inquiry support and briefings.",
    descShort: "Refine your strategy with workshops, leads and partner support.",
    intro:
      "Successfully Bring Your Products to Market With Our Tried and Tested Methodology. We support you with these tools.",
    content: [
      {
        type: "highlights",
        items: [
          {
            name: "Strategy Workshops",
            description:
              "Gain actionable insights and develop future-focused strategies through Telco Republic's expert-led workshops, helping you navigate complex telecom challenges. These sessions empower your organization to align your teams and accelerate decision-making with tailored, industry-specific guidance.",
          },
          {
            name: "Partner Matchmaking",
            description:
              "Telco Republic connects you with vetted, high-potential partners from its extensive industry network, ensuring strategic alignment and mutual value creation. This service streamlines the process of finding the right collaborators, saving time and maximizing partnership success.",
          },
          {
            name: "Briefings and Inquiries",
            description:
              "You receive timely, in-depth briefings and answers to pressing questions, leveraging Telco Republic's deep market knowledge and independent perspective. This enables you to stay ahead of industry trends and make informed decisions quickly.",
          },
          {
            name: "Go-to-Market Advice",
            description:
              "Telco Republic provides customized, unbiased advice that addresses your unique business needs and objectives. This personalized approach ensures that recommendations are practical, actionable and directly aligned with your goals.",
          },
          {
            name: "RFP and RFI Advice",
            description:
              "You benefit from expert support in crafting and evaluating RFPs and RFIs, improving the quality and clarity of your procurement processes. Telco Republic's guidance helps you select the right vendors and achieve better outcomes from your technology investments.",
          },
          {
            name: "Lead Generation",
            description:
              "Telco Republic leverages its market reach and industry expertise to generate high-quality leads for clients, accelerating business development efforts. This targeted approach increases visibility and connects you with relevant opportunities in the telecom ecosystem.",
          },
        ],
      },
    ] as const satisfies readonly ServiceContentBlock[],
  },
  {
    slug: "market-assessment",
    title: "Market Assessment",
    desc: "Advance your business with addressable market insights, market entry evaluations, market segmentation and emerging vendors insights.",
    descShort: "Advance with market insights, entry strategy, and vendor intelligence.",
    intro: "We help you plan where to invest your resources.",
    content: [
      {
        type: "pillars",
        items: [
          { text: "We slice and dice your market however you desire." },
          { text: "We transform your unstructured data into actionable advice." },
          {
            text: "Our proven methodology takes the guesswork out of your strategic planning.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Use these deliverables to always be in the know",
      },
      {
        type: "highlights",
        items: [
          {
            name: "Strategic Market Analysis",
            description:
              "Gain actionable insights into telecom market dynamics to make data-driven decisions and identify growth opportunities. Telco Republic's in-depth analysis helps you stay ahead of industry trends and competitive shifts.",
          },
          {
            name: "Market Entry Evaluation",
            description:
              "Telco Republic provides you with comprehensive assessments of new markets, highlighting potential risks and success factors. This empowers you to develop robust entry strategies and minimize uncertainties when expanding your operations.",
          },
          {
            name: "Focused Digital Events",
            description:
              "Benefit from expertly curated digital events that connect you with industry leaders and innovators, fostering knowledge sharing and networking. These events drive engagement and keep organizations informed about the latest telecom developments.",
          },
          {
            name: "Executive Roundtables",
            description:
              "Telco Republic facilitates exclusive roundtable discussions, enabling you to exchange ideas with C-level peers and industry experts. This format supports strategic collaboration and the development of forward-thinking solutions.",
          },
          {
            name: "Market Segmentation",
            description:
              "You receive detailed segmentation analyses that clarify target audiences and optimize go-to-market strategies. Telco Republic's approach ensures tailored messaging and maximized market reach.",
          },
          {
            name: "Disruptive Technology Strategies",
            description:
              "Telco Republic guides you in identifying and leveraging disruptive technologies to gain a competitive edge. Telco Republic's strategic advice accelerates innovation and positions you at the forefront of industry transformation.",
          },
          {
            name: "Emerging Vendors",
            description:
              "Telco Republic connects you with promising new vendors, expanding your access to innovative solutions and technologies. This helps you stay agile and responsive to evolving market demands.",
          },
          {
            name: "Technology Investment Assessment",
            description:
              "You receive objective evaluations of technology investments, ensuring alignment with business goals and maximizing ROI. Telco Republic's expertise helps you prioritize initiatives with the highest impact.",
          },
          {
            name: "Addressable Market Plans",
            description:
              "You receive clear, data-backed addressable market plans that identify and quantify growth opportunities. Telco Republic's guidance supports effective resource allocation and targeted business development.",
          },
        ],
      },
    ] as const satisfies readonly ServiceContentBlock[],
  },
  {
    slug: "custom-research",
    title: "Custom Research",
    desc: "Gain in-depth insights tailored toward your individual requirements with our personalized custom research services.",
    descShort: "Get tailored insights with custom research services.",
    intro:
      "We empower our clients with leading-edge insights to drive smarter decisions, unlock growth opportunities and stay ahead in a rapidly evolving market.",
    content: [
      {
        type: "pillars",
        items: [
          { text: "Our team of industry experts will support your specific requirements." },
          {
            text: "We establish partnerships without the red tape of large organizations.",
          },
          {
            text: "Our style is personalized, collaborative, unbiased, in-depth, leading-edge and disruptive.",
          },
        ],
      },
      {
        type: "highlights",
        heading: "How we work with you",
        items: [
          {
            name: "Personalized",
            description:
              "We provide personalized services tailored to each client's unique needs, ensuring customized solutions that drive success and satisfaction.",
          },
          {
            name: "Collaborative",
            description:
              "We empower our clients through collaborative interactions by fostering open communication, shared goals and teamwork to deliver tailored solutions that drive success and build lasting partnerships.",
          },
          {
            name: "Unbiased",
            description:
              "We provide our clients with clear, unbiased advice to help them make informed decisions and achieve their goals confidently.",
          },
          {
            name: "Disruptive",
            description:
              "We empower our clients with disruptive insights that unlock new opportunities, drive innovation and transform their business strategies for lasting competitive advantage.",
          },
          {
            name: "In Depth - High Quality",
            description:
              "We deliver in-depth, high-quality work that empowers our clients to achieve exceptional results with expert precision and unwavering commitment.",
          },
          {
            name: "Leading Edge",
            description:
              "We empower our clients with leading-edge insights to drive smarter decisions, unlock growth opportunities and stay ahead in a rapidly evolving market.",
          },
        ],
      },
      { type: "customResearchDiagram" },
    ] as const satisfies readonly ServiceContentBlock[],
  },
] as const satisfies readonly ServiceRecord[];

export type ServiceEntry = ServiceRecord;

export function getServiceBySlug(slug: string): ServiceEntry | undefined {
  return services.find((s) => s.slug === slug);
}

export function serviceIndexFromSlug(slug: string): number {
  return services.findIndex((s) => s.slug === slug);
}
