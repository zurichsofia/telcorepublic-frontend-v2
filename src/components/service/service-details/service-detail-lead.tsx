import {
  serviceDetailColumn,
  serviceDetailStack,
} from "@/components/service/service-details/service-detail-styles";
import { cn } from "@/lib/utils";

export type ServiceDetailLeadProps = {
  title: string;
  intro?: string;
};

export function ServiceDetailLead({ title, intro }: ServiceDetailLeadProps) {
  return (
    <header className={cn(serviceDetailColumn, serviceDetailStack, "pt-20 md:pt-24")}>
      <h1 className="text-xl font-normal leading-snug text-telco-red sm:text-2xl md:text-4xl max-w-4xl mx-auto">
        {title}
      </h1>
      {intro ? (
        <p className="max-w-4xl mx-auto text-xl font-light leading-relaxed text-telco-red">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
