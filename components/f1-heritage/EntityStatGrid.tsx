"use client";

import { formatStat } from "@/lib/f1/utils";

interface StatItem {
  label: string;
  value: number | null | string;
}

export function EntityStatGrid({ stats }: { stats: StatItem[] }) {
  return (
    <dl className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-heritage-border bg-heritage-panel/50 px-3 py-2.5"
        >
          <dt className="text-[10px] uppercase tracking-widest text-heritage-muted">
            {stat.label}
          </dt>
          <dd className="mt-1 font-display text-lg text-heritage-ivory">
            {typeof stat.value === "number" || stat.value === null
              ? formatStat(stat.value as number | null)
              : stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
