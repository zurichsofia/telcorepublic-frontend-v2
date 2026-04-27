"use client";

import { ServiceSectionIntro } from "./service-section-intro";
import { ServiceSectionList } from "./service-section-list";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative isolate w-full overflow-hidden bg-white py-32 sm:py-40 md:py-44"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-24 lg:grid-cols-12 lg:gap-x-20 lg:gap-y-28 xl:gap-x-24 xl:gap-y-32">
          <ServiceSectionIntro />
          <ServiceSectionList />
        </div>
      </div>
    </section>
  );
}
