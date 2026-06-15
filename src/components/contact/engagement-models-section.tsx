import type { EngagementModel } from "@/data/engagement-models";
import { cn } from "@/lib/utils";

function EngagementModelCard({
  model,
  variant = "default",
}: {
  model: EngagementModel;
  variant?: "default" | "featured";
}) {
  const isFeatured = variant === "featured";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-neutral-700/10 bg-white p-6 ring-1 ring-neutral-700/5 sm:p-8",
        isFeatured && "lg:flex-row lg:items-start lg:gap-10 xl:gap-14",
      )}
    >
      <div className={cn(isFeatured && "lg:max-w-xs lg:shrink-0 xl:max-w-sm")}>
        <h3
          className={cn(
            "font-display leading-tight text-telco-red",
            isFeatured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
          )}
        >
          {model.name}
        </h3>
      </div>

      <div
        className={cn(
          "mt-4 flex flex-1 flex-col gap-4",
          isFeatured && "lg:mt-0 lg:border-l lg:border-neutral-700/10 lg:pl-10 xl:pl-14",
        )}
      >
        {model.description.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base font-light leading-relaxed text-telco-dark sm:text-base"
          >
            {paragraph}
          </p>
        ))}

        {model.callout ? (
          <p
            className={cn(
              "text-sm font-medium leading-relaxed text-telco-dark sm:text-base",
              isFeatured
                ? "mt-2"
                : "mt-6 border-t border-neutral-700/10 pt-4",
            )}
          >
            {model.callout}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function EngagementModelsSection({
  models,
  className,
}: {
  models: readonly EngagementModel[];
  className?: string;
}) {
  const consultationModels = models.filter((model) => model.name !== "Subscription");
  const subscriptionModel = models.find((model) => model.name === "Subscription");

  return (
    <section
      className={cn("mx-auto max-w-6xl px-5 sm:px-8", className)}
      aria-label="Engagement models"
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
      >
        {consultationModels.map((model) => (
          <li key={model.name} className="min-w-0">
            <EngagementModelCard model={model} />
          </li>
        ))}
      </ul>

      {subscriptionModel ? (
        <div className="mt-6 lg:mt-8">
          <EngagementModelCard model={subscriptionModel} variant="featured" />
        </div>
      ) : null}
    </section>
  );
}
