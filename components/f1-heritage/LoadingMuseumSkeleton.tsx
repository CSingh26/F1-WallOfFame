export function LoadingMuseumSkeleton() {
  return (
    <main className="min-h-screen bg-heritage-bg px-4 py-8 text-heritage-ivory">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="h-72 animate-pulse rounded-lg border border-heritage-border bg-heritage-panel/70" />
        <div className="grid gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-lg border border-heritage-border bg-white/[0.04]"
            />
          ))}
        </div>
        <div className="h-[32rem] animate-pulse rounded-lg border border-heritage-border bg-white/[0.035]" />
      </div>
    </main>
  );
}
