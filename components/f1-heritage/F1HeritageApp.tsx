"use client";

import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  EraBand,
  F1EntityMode,
  HeritageEntity,
  SearchResult,
  StatsSummary,
} from "@/lib/f1/types";
import { useHeritageStore } from "./store";
import { HeritageHero } from "./HeritageHero";
import { Timeline } from "./Timeline";
import { PlacardDrawer } from "./PlacardDrawer";
import { SearchCommand } from "./SearchCommand";
import { CompareDock } from "./CompareDock";
import { TrophyRoomShell } from "./TrophyRoomShell";
import { LoadingMuseumSkeleton } from "./LoadingMuseumSkeleton";
import { ErrorState } from "./StateViews";

interface EntitiesResponse {
  mode: F1EntityMode;
  count: number;
  entities: HeritageEntity[];
}

interface F1HeritageAppProps {
  stats: StatsSummary;
  eraBands: EraBand[];
}

async function fetchEntities(mode: F1EntityMode): Promise<HeritageEntity[]> {
  const res = await fetch(`/api/f1/entities?mode=${mode}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to load ${mode} entities`);
  const json = (await res.json()) as EntitiesResponse;
  return json.entities;
}

export function F1HeritageApp({ stats, eraBands }: F1HeritageAppProps) {
  const mode = useHeritageStore((s) => s.mode);
  const setMode = useHeritageStore((s) => s.setMode);
  const selected = useHeritageStore((s) => s.selected);
  const placardOpen = useHeritageStore((s) => s.placardOpen);
  const openPlacard = useHeritageStore((s) => s.openPlacard);
  const closePlacard = useHeritageStore((s) => s.closePlacard);
  const enterRoom = useHeritageStore((s) => s.enterRoom);
  const searchOpen = useHeritageStore((s) => s.searchOpen);
  const setSearchOpen = useHeritageStore((s) => s.setSearchOpen);
  const compare = useHeritageStore((s) => s.compare);
  const toggleCompare = useHeritageStore((s) => s.toggleCompare);
  const clearCompare = useHeritageStore((s) => s.clearCompare);

  const {
    data: entities,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["f1-entities", mode],
    queryFn: () => fetchEntities(mode),
    staleTime: 5 * 60 * 1000,
  });

  // "/" opens the search palette.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !searchOpen &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, setSearchOpen]);

  const handlePick = useCallback(
    (result: SearchResult) => {
      if (result.entity.mode !== mode) setMode(result.entity.mode);
      openPlacard(result.entity);
      setSearchOpen(false);
    },
    [mode, setMode, openPlacard, setSearchOpen],
  );

  const inCompare = selected
    ? compare.some((e) => e.id === selected.id && e.mode === selected.mode)
    : false;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:px-8">
      <HeritageHero
        mode={mode}
        onModeChange={setMode}
        onOpenSearch={() => setSearchOpen(true)}
        stats={stats}
      />

      <section className="mt-8" aria-label="Heritage timeline">
        {isLoading ? (
          <LoadingMuseumSkeleton />
        ) : isError ? (
          <ErrorState
            title="Could not load the timeline"
            message="The heritage data failed to load. Please try again."
            onRetry={() => refetch()}
          />
        ) : (
          <Timeline
            entities={entities ?? []}
            eraBands={eraBands}
            startYear={stats.startYear}
            endYear={stats.currentYear}
            onSelect={openPlacard}
          />
        )}
      </section>

      <PlacardDrawer
        entity={selected}
        open={placardOpen}
        onClose={closePlacard}
        onEnterRoom={(entity) => {
          closePlacard();
          enterRoom(entity);
        }}
        onToggleCompare={toggleCompare}
        inCompare={inCompare}
      />

      <SearchCommand
        open={searchOpen}
        mode={mode}
        onClose={() => setSearchOpen(false)}
        onPick={handlePick}
      />

      <CompareDock
        entities={compare}
        onRemove={toggleCompare}
        onClear={clearCompare}
      />

      <TrophyRoomShell />
    </main>
  );
}
