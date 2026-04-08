import type { Metadata } from "next";

import { SnowMountainLanding } from "@/components/snow-mountain-landing";

export const metadata: Metadata = {
  title: "Telcorepublic Research",
  description:
    "Premium telecom research-spectrum, infrastructure, and intelligence with clarity.",
};

export default function Home() {
  return (
    <main id="home" className="relative z-10 isolate">
      <SnowMountainLanding />
    </main>
  );
}
