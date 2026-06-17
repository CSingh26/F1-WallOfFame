"use client";

import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { HeritageHero } from "./HeritageHero";
import { Timeline } from "./Timeline";
import { PlacardDrawer } from "./PlacardDrawer";
import { CompareDock } from "./CompareDock";
import { TrophyRoomShell } from "./TrophyRoomShell";
import { EmptyState } from "./EmptyState";
import { useHeritageUiStore } from "@/lib/f1/heritage-store";
import type {
  EraBand,
  F1DriverEntity,
  F1EntityMode,
  F1TeamEntity,
  HeritageStatsSummary,
  HydratedF1Entity,
  SearchResult,
} from "@/lib/f1/types";

type EntitiesPayload = {
  mode: F1EntityMode;
  entities: HydratedF1Entity[];
};

async function fetchEntities(mode: F1EntityMode): Promise<EntitiesPayload> {
  const response = await fetch(`/api/f1/entities?mode=${mode}`, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Could not load heritage entities");
  }

  return (await response.json()) as EntitiesPayload;
}

function entityKey(entity: HydratedF1Entity) {
  return `${entity.mode}:${entity.id}`;
}

function F1HeritageExperience({
  initialDrivers,
  initialTeams,
  eraBands,
  stats,
}: {
  initialDrivers: HydratedF1Entity<F1DriverEntity>[];
  initialTeams: HydratedF1Entity<F1TeamEntity>[];
  eraBands: EraBand[];
  stats: HeritageStatsSummary;
}) {
  const mode = useHeritageUiStore((state) => state.mode);
  const setMode = useHeritageUiStore((state) => state.setMode);
  const [selectedEntity, setSelectedEntity] = useState<HydratedF1Entity | null>(null);
  const [roomEntity, setRoomEntity] = useState<HydratedF1Entity | null>(null);
  const [compareItems, setCompareItems] = useState<HydratedF1Entity[]>([]);
  const initialByMode = useMemo(
    () => ({
      driver: initialDrivers as HydratedF1Entity[],
      team: initialTeams as HydratedF1Entity[],
    }),
    [initialDrivers, initialTeams],
  );

  const entitiesQuery = useQuery({
    queryKey: ["f1-entities", mode],
    queryFn: () => fetchEntities(mode),
    initialData: () => ({ mode, entities: initialByMode[mode] }),
    staleTime: 60_000,
  });

  const entities = entitiesQuery.data.entities;

  function handleModeChange(nextMode: F1EntityMode) {
    setMode(nextMode);
    if (selectedEntity?.mode !== nextMode) {
      setSelectedEntity(null);
    }
  }

  function handleSearchSelect(result: SearchResult) {
    setMode(result.mode);
    setSelectedEntity(result.entity);
  }

  function addCompare(entity: HydratedF1Entity) {
    setCompareItems((items) => {
      if (items.some((item) => entityKey(item) === entityKey(entity))) {
        return items;
      }
      if (items.length >= 2) {
        return items;
      }
      return [...items, entity];
    });
  }

  const compareDisabled =
    Boolean(selectedEntity) &&
    compareItems.length >= 2 &&
    !compareItems.some((item) => selectedEntity && entityKey(item) === entityKey(selectedEntity));

  return (
    <main className="min-h-screen bg-heritage-bg text-heritage-ivory">
      <HeritageHero
        mode={mode}
        stats={stats}
        eraBands={eraBands}
        onModeChange={handleModeChange}
        onSearchSelect={handleSearchSelect}
      />

      {entitiesQuery.isError ? (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <EmptyState
            title="Archive API unavailable"
            message="The local seed archive remains bundled with the page. Reloading will retry the API route."
          />
        </section>
      ) : (
        <Timeline
          mode={mode}
          entities={entities}
          eraBands={eraBands}
          currentYear={stats.currentYear}
          selectedId={selectedEntity ? entityKey(selectedEntity) : null}
          onSelect={setSelectedEntity}
        />
      )}

      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-lg border border-heritage-border bg-black/35 p-5 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-heritage-gold">
              Data posture
            </div>
            <p className="mt-2 text-sm leading-6 text-heritage-muted">
              Seed archive active. Exact mutable stats are reserved for Jolpica/OpenF1 sync.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-heritage-gold">
              Images
            </div>
            <p className="mt-2 text-sm leading-6 text-heritage-muted">
              Approved manifest first; generated fallback visuals by default.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-heritage-gold">
              Search
            </div>
            <p className="mt-2 text-sm leading-6 text-heritage-muted">
              Upstash Vector when configured, deterministic archive matching otherwise.
            </p>
          </div>
        </div>
      </section>

      <PlacardDrawer
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onEnterRoom={setRoomEntity}
        onCompare={addCompare}
        compareDisabled={compareDisabled}
      />

      <CompareDock
        items={compareItems}
        onRemove={(key) => setCompareItems((items) => items.filter((item) => entityKey(item) !== key))}
        onClear={() => setCompareItems([])}
        onOpen={setSelectedEntity}
      />

      <TrophyRoomShell entity={roomEntity} onClose={() => setRoomEntity(null)} />
    </main>
  );
}

export function F1HeritageApp({
  initialDrivers,
  initialTeams,
  eraBands,
  stats,
}: {
  initialDrivers: HydratedF1Entity<F1DriverEntity>[];
  initialTeams: HydratedF1Entity<F1TeamEntity>[];
  eraBands: EraBand[];
  stats: HeritageStatsSummary;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <F1HeritageExperience
        initialDrivers={initialDrivers}
        initialTeams={initialTeams}
        eraBands={eraBands}
        stats={stats}
      />
    </QueryClientProvider>
  );
}
