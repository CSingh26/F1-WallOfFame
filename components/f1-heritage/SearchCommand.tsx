"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import type { F1EntityMode, SearchResult } from "@/lib/f1/types";
import { cn } from "@/lib/f1/utils";

type SearchPayload = {
  strategy: "vector" | "local";
  results: SearchResult[];
  note: string | null;
};

export function SearchCommand({
  mode,
  onSelect,
}: {
  mode: F1EntityMode;
  onSelect: (result: SearchResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [strategy, setStrategy] = useState<"vector" | "local" | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedQuery = query.trim();

  const placeholder = useMemo(
    () =>
      mode === "driver"
        ? "Search Senna, British champions, Schumacher era"
        : "Search Ferrari vs McLaren, turbo teams, 1970s",
    [mode],
  );

  useEffect(() => {
    if (!trimmedQuery) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/f1/search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ query: trimmedQuery, mode }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const payload = (await response.json()) as SearchPayload;
        setResults(payload.results);
        setStrategy(payload.strategy);
        setNote(payload.note);
      } catch (searchError) {
        if (!controller.signal.aborted) {
          setError(searchError instanceof Error ? searchError.message : "Search failed");
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [mode, trimmedQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) {
      onSelect(results[0]);
      setQuery("");
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-heritage-border bg-black/55 p-2 shadow-museum backdrop-blur"
      >
        <label className="sr-only" htmlFor="heritage-search">
          Search F1 heritage archive
        </label>
        <div className="flex items-center gap-2">
          <Search className="ml-2 h-5 w-5 text-heritage-gold" aria-hidden="true" />
          <input
            ref={inputRef}
            id="heritage-search"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (!value.trim()) {
                setResults([]);
                setStrategy(null);
                setNote(null);
                setError(null);
              }
            }}
            placeholder={placeholder}
            className="min-h-12 flex-1 bg-transparent px-2 text-sm text-heritage-ivory outline-none placeholder:text-heritage-muted"
          />
          <button
            type="submit"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-heritage-red text-white outline-none transition hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-heritage-gold"
            aria-label="Run heritage search"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </button>
        </div>
      </form>

      {(results.length > 0 || note || error) && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-lg border border-heritage-border bg-[#090909]/95 shadow-museum backdrop-blur">
          {strategy ? (
            <div className="border-b border-heritage-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-heritage-muted">
              {strategy === "vector" ? "Semantic archive" : "Local archive"}
            </div>
          ) : null}
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => {
                onSelect(result);
                setQuery("");
                setResults([]);
              }}
              className={cn(
                "block w-full border-b border-white/[0.06] px-4 py-3 text-left outline-none transition last:border-b-0 hover:bg-white/[0.06] focus-visible:bg-white/[0.08]",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-heritage-ivory">{result.title}</span>
                <span className="rounded-full border border-heritage-border px-2 py-0.5 text-xs text-heritage-gold">
                  {result.mode}
                </span>
              </div>
              <div className="mt-1 text-sm text-heritage-muted">{result.subtitle}</div>
              <div className="mt-1 text-xs text-heritage-muted">{result.reason}</div>
            </button>
          ))}
          {note ? <p className="px-4 py-3 text-xs leading-5 text-heritage-muted">{note}</p> : null}
          {error ? <p className="px-4 py-3 text-xs leading-5 text-red-200">{error}</p> : null}
        </div>
      )}
    </div>
  );
}
