import type { HydratedF1Entity } from "@/lib/f1/types";
import { entityTitle } from "@/lib/f1/utils";

export function TimelineTooltip({ entity }: { entity: HydratedF1Entity }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+0.65rem)] left-1/2 z-20 hidden w-64 -translate-x-1/2 rounded-md border border-heritage-border bg-black/95 p-3 text-left shadow-museum group-hover:block group-focus-within:block">
      <span className="block text-sm font-semibold text-heritage-ivory">{entityTitle(entity)}</span>
      <span className="mt-1 block text-xs leading-5 text-heritage-muted">
        Debut {entity.debutYear}
        {entity.championshipYears.length
          ? ` • Titles ${entity.championshipYears.join(", ")}`
          : " • Championship data syncing"}
      </span>
      <span className="mt-2 block text-xs leading-5 text-heritage-muted">
        {entity.mode === "driver" ? entity.bio30Words : entity.profile30Words}
      </span>
    </span>
  );
}
