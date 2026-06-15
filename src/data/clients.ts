export type ClientLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
  /** Compensates for tight or loose cropping in source artwork (1 = default). */
  scale?: number;
};

export const clientLogos: readonly ClientLogo[] = [
  {
    name: "HPE",
    src: "/images/about/clients/hpe.jpg",
    width: 200,
    height: 80,
    scale: 1.3,
  },
  {
    name: "Amazon Web Services",
    src: "/images/about/clients/aws.png",
    width: 200,
    height: 80,
    scale: 0.9,
  },
  {
    name: "Netcracker",
    src: "/images/about/clients/netcracker.png",
    width: 200,
    height: 80,
    scale: 0.8,
  },
  {
    name: "Kloudville",
    src: "/images/about/clients/kloudville.png",
    width: 200,
    height: 80,
    scale: 1.1,
  },
  {
    name: "Symphonica",
    src: "/images/about/clients/symphonica.png",
    width: 200,
    height: 80,
    scale: 1.4,
  },
  {
    name: "Intraway",
    src: "/images/about/clients/intraway.png",
    width: 200,
    height: 80,
    scale: 0.8,
  },
];
