"use client";

import Image from "next/image";

export function CustomResearchRadialDiagram() {
  return (
    <figure
      className="mx-auto w-full max-w-[min(100%,640px)]"
      aria-label="Telco Republic research values diagram"
    >
      <Image
        src="/images/custom-research-values-diagram.png"
        alt="Circular diagram of research values: Disruptive, Personalized, Collaborative, Unbiased, Leading Edge, and In Depth High Quality around the TR mark."
        width={1024}
        height={749}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 640px"
      />
    </figure>
  );
}
