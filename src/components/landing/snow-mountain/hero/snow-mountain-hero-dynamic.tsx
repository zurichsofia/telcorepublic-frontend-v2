"use client";

import dynamic from "next/dynamic";

import { StaticHeroPoster } from "./static-hero-poster";

export const SnowMountainHero = dynamic(
  () =>
    import("./snow-mountain-hero").then((module) => module.SnowMountainHero),
  { ssr: false, loading: () => <StaticHeroPoster /> },
);
