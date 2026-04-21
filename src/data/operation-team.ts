export type OperationTeamMember = {
  id: string;
  name: string;
  role: string;
  /** Shown before “Read more”. */
  previewParagraphs: readonly string[];
  /** Shown after expanding “Read more”. */
  moreParagraphs: readonly string[];
};

export const operationTeamMembers: readonly OperationTeamMember[] = [
  {
    id: "martina-kurth",
    name: "Martina Kurth",
    role: "CEO",
    previewParagraphs: [
      "Martina Kurth is an established industry analyst and seasoned strategic business and technology Advisor in the global telco industry.",
      "Having worked for the top 3 world leading analyst firms, Martina has nearly 20 years of subject matter expertise in the global telecom sector.",
      "She has been leading high-profile engagements, where she advised Telco CIOs and CTOs regarding mission critical investments.",
      "Her research/advisory expertise pertains to intertwined telco infrastructure & software related topics, incl. Digital technology platforms, cloud, 5G, edge, IoT, customer experience and AI/analytics.",
    ],
    moreParagraphs: [
      "Particular emphasis is placed on the operational, monetization and customer engagement technology evolution, as well as new operating models, required to tap into digital business model innovations. This perspective encompasses structural process, organization and cultural change management.",
      "Martina leverages a well-established contact network with CSPs, vendors, standard bodies, start-ups and investors in the global telco industry. She is frequently requested for delivering executive leadership workshops, industry speaking engagements and media articles and quotes, such as Forbes.",
      "Previously, Martina has held various senior roles in the Telco industry, comprising product management, business development and technology consulting positions with Ericsson Hewlett Packard Telecom (EHPT) and Nokia, which included start-ups of telco green-field operations. She has been hands-on involved in Telco standards shaping technology evolution with leading global standards organizations, including 5G BVME in Europe, and TM Forum, US.",
      "Martina holds a B.A. Economic and Political Sciences Hamburg University, and an M.A. in European Business and Information Technology from Newcastle University, UK.",
    ],
  },
  {
    id: "norbert-scholz",
    name: "Norbert Scholz",
    role: "Head of Telco Research & Advisory",
    previewParagraphs: [
      "With over 20 years experience, Norbert Scholz is a renowned global industry analyst, strategist, market researcher and forecaster, with focus on the BSS and CRM segment in the comms industry.",
      "His coverage comprises fixed, mobile, cable, software as a service (SaaS) and subscription services.",
      "He has led hype cycles, magic quadrants, as well as technology innovation and emerging market analysis for syndicated and custom research projects.",
    ],
    moreParagraphs: [
      "Areas of expertise include the use and adoption of software and professional services, such as billing, rating, charging, pricing, monetization, order-to-cash, mediation, customer care, fraud management, PCRF, revenue assurance, subscription management, digital transformation, IT transformation, network transformation, corporate strategy, benchmarking, IoT, customer experience, self-service, automation and business support systems (BSS).",
      "During over two decades working for research and consulting firms, including Gartner, and as an independent analyst, he has been offering insights and advice to vendors and communications service providers around strategy evolution, technology selection, product positioning and pricing strategies, process optimization, benchmarking and competitive differentiation.",
      "Norbert holds a PhD and an MA from Georgetown University in Washington, DC and a BA from the University of Tübingen, Germany.",
    ],
  },
  {
    id: "brendan-logan",
    name: "Brendan Logan",
    role: "Co-Founder",
    previewParagraphs: [
      "Brendan Logan has worked in the telecom industry for over 35 years in a variety of operator and vendor roles and is widely known within the telecom Industry.",
      "He has been at the forefront of many technology changes within the industry, and he cofounded Logan-Orviss, a successful strategic OSS/BSS consulting company within the industry for 12 years.",
    ],
    moreParagraphs: [
      "He has just retired from Oracle as the Global Vice President of Consulting with the Communications Global Business Unit, a position he has held for 12 years. He is a well-known influencer, speaker, commentator and writer on industry topics.",
    ],
  },
];
