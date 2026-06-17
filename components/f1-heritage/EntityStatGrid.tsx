import { cn } from "@/lib/f1/utils";

export function EntityStatGrid({
  stats,
  compact = false,
}: {
  stats: Array<{ label: string; value: string | number; tone?: "gold" | "muted" }>;
  compact?: boolean;
}) {
  return (
    <dl className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-md border border-heritage-border bg-white/[0.035] p-3">
          <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-heritage-muted">{stat.label}</dt>
          <dd
            className={cn(
              "mt-2 text-lg font-semibold",
              stat.tone === "gold" ? "text-heritage-gold" : "text-heritage-ivory",
              stat.tone === "muted" && "text-heritage-muted",
            )}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
