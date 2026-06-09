"use client";

import { ServiceDetailBlock } from "@/components/service/service-details/service-detail-blocks";
import { ServiceDetailLead } from "@/components/service/service-details/service-detail-lead";
import { serviceDetailBlockStack } from "@/components/service/service-details/service-detail-styles";
import type { ServiceEntry } from "@/data/services";

export type ServiceDetailsProps = {
  service: ServiceEntry;
};

export function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
    <div className="bg-white py-24 md:py-32 lg:py-40">
      <div className={serviceDetailBlockStack}>
        <ServiceDetailLead title={service.desc} intro={service.intro} />

        {service.content.map((block, i) => (
          <ServiceDetailBlock
            key={`${service.slug}-${block.type}-${i}`}
            block={block}
          />
        ))}
      </div>
    </div>
  );
}
