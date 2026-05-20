export type OperationTeamMember = {
  id: string;
  name: string;
  role: string;
  linkedinUrl: string;
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
    linkedinUrl: "https://www.linkedin.com/in/martina-kurth",
    previewParagraphs: [
      "Martina is a seasoned Executive in the global Tech Business, having worked 15 years for the No 1, most influential global Tech Strategy company Gartner ($6 billion). Martina has advised top Fortune 500 clients around the globe.",
      "As passionate and accomplished C-level advisor and research leader, she provides high-quality, innovative market analysis and advisory services to global clients. She has demonstrated leadership skills to lead globally dispersed teams.",
    ],
    moreParagraphs: [
      "Martina is a founder of Telco Republic AG, a boutique consultancy firm that specializes in telco innovation research and thought leadership executive advisory, in Jan 2022. As a senior high tech subject-matter expert, Martina leverages her extensive expertise and contact network to help CIOs, CTOs, CDOs, and senior executives make strategic technology investment decisions to optimize their digital business infrastructures and capitalize business outcomes.",
      "Areas of expertise include Cloud, 5G, IoT, generative AI, CX, and blockchain, as well as the organizational and cultural change management required to succeed in digital transformation. Martina frequently is involved in executive leadership workshops, industry speaking engagements, and global media quotes, providing thought leadership vision and insights on the future of high tech & telco.",
    ],
  },
  {
    id: "norbert-scholz",
    name: "Norbert Scholz",
    role: "Head of Telco Research & Advisory",
    linkedinUrl: "https://www.linkedin.com/in/norbert-scholz/",
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
    linkedinUrl: "https://www.linkedin.com/in/loganbrendan/",
    previewParagraphs: [
      "Brendan Logan has worked in the telecom industry for over 35 years in a variety of operator and vendor roles and is widely known within the telecom Industry.",
      "He has been at the forefront of many technology changes within the industry, and he cofounded Logan-Orviss, a successful strategic OSS/BSS consulting company within the industry for 12 years.",
    ],
    moreParagraphs: [
      "He has just retired from Oracle as the Global Vice President of Consulting with the Communications Global Business Unit, a position he has held for 12 years. He is a well-known influencer, speaker, commentator and writer on industry topics.",
    ],
  },
];
