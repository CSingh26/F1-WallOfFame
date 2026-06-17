export function LoadingMuseumSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading the museum">
      <div className="space-y-4">
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-heritage-panel/70" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-heritage-panel/50" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl bg-heritage-panel/60"
          />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-2xl bg-gradient-to-r from-heritage-panel/40 via-heritage-panel/70 to-heritage-panel/40 bg-[length:200%_100%]" />
    </div>
  );
}
