import type { Metadata } from "next";

import { SnowMountainLanding } from "@/components/snow-mountain-landing";

export const metadata: Metadata = {
  title: "Summit | Telcorepublic Research",
  description:
    "Premium telecom research—spectrum, infrastructure, and intelligence with clarity.",
};

export default function SnowMountainPage() {
  return (
    <main className="theme-snow-ice relative min-h-screen bg-[var(--ice-950)]">
      <SnowMountainLanding />
    </main>
  );
}
