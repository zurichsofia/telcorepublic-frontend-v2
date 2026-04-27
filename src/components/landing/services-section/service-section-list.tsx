import { services } from "@/data/services";

import { ServiceSectionListItem } from "./service-section-list-item";

export function ServiceSectionList() {
  return (
    <div className="lg:col-span-7">
      <div className="border-t border-b border-[color-mix(in_srgb,var(--color-clouds)_45%,transparent)]">
        <ul className="divide-y divide-[color-mix(in_srgb,var(--color-clouds)_40%,transparent)]">
          {services.map((s, i) => (
            <ServiceSectionListItem key={s.slug} service={s} index={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
