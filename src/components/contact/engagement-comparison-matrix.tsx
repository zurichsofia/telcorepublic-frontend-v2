import {
  engagementComparisonIntro,
  engagementComparisonRows,
  engagementModelColumns,
} from "@/data/engagement-models";
import { cn } from "@/lib/utils";

const thClass =
  "px-3 py-3 text-left text-xs font-medium leading-snug sm:px-4 sm:py-3.5 sm:text-sm";
const tdClass =
  "px-3 py-3 text-center text-sm font-medium sm:px-4 sm:py-3.5 sm:text-base";

export function EngagementComparisonMatrix({ className }: { className?: string; }) {
  return (
    <section
      className={cn("mx-auto min-w-0 max-w-6xl px-5 sm:px-8", className)}
      aria-label="Engagement model comparison"
    >
      <p className="mb-6 text-center text-lg font-medium leading-relaxed text-telco-dark sm:mb-8 sm:text-base">
        {engagementComparisonIntro}
      </p>

      <div className="w-0 min-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-neutral-700/10 ring-1 ring-neutral-700/5 [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-176 border-collapse text-telco-dark">
          <caption className="sr-only">
            Comparison of Telco Republic services across engagement models
          </caption>
          <thead>
            <tr className="bg-telco-dark text-white">
              <th scope="col" className={cn(thClass, "min-w-36 font-semibold")}>
                <span className="sr-only">Service</span>
              </th>
              {engagementModelColumns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(thClass, "min-w-24 text-center font-semibold")}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {engagementComparisonRows.map((row, index) => (
              <tr
                key={row.service}
                className={cn(index % 2 === 1 ? "bg-neutral-50" : "bg-white")}
              >
                <th
                  scope="row"
                  className={cn(
                    tdClass,
                    "text-left text-sm font-semibold sm:text-base",
                  )}
                >
                  {row.service}
                </th>
                {engagementModelColumns.map((column) => {
                  const included = row.included[column];

                  return (
                    <td key={column} className={tdClass}>
                      <span className="sr-only">
                        {included ? "Included" : "Not included"}
                      </span>
                      {included ? (
                        <span aria-hidden className="font-semibold">
                          X
                        </span>
                      ) : (
                        <span aria-hidden className="text-neutral-300">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
