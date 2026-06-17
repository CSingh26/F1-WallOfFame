"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Loader2, Sparkles, Database } from "lucide-react";
import type { F1EntityMode, SearchResult } from "@/lib/f1/types";
import { cn } from "@/lib/f1/utils";
import { NoSearchResults } from "./StateViews";

interface SearchCommandProps {
  open: boolean;
  mode: F1EntityMode;
  onClose: () => void;
  onPick: (result: SearchResult) => void;
}

export function SearchCommand({
  open,
  mode,
  onClose,
  onPick,
}: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"driver" | "team" | "all">(mode);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedVector, setUsedVector] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setScope(mode);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [open, mode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const runSearch = useCallback(
    async (q: string, s: "driver" | "team" | "all") => {
      if (q.trim().length === 0) {
        setResults([]);
        setSearched(false);
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await fetch("/api/f1/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, mode: s }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        setResults(data.results ?? []);
        setUsedVector(Boolean(data.usedVector));
        setSearched(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
          setSearched(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const id = setTimeout(() => runSearch(query, scope), 220);
    return () => clearTimeout(id);
  }, [query, scope, runSearch]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the heritage archive"
            className="fixed left-1/2 top-[12vh] z-[61] w-[92vw] max-w-xl -translate-x-1/2"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
          >
            <div className="heritage-glass overflow-hidden rounded-2xl shadow-heritage-panel">
              <div className="flex items-center gap-3 border-b border-heritage-border px-4 py-3">
                <Search className="h-5 w-5 text-heritage-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. drivers like Senna, turbo era champions, British champions…"
                  className="flex-1 bg-transparent text-sm text-heritage-ivory placeholder:text-heritage-muted focus:outline-none"
                  aria-label="Search query"
                />
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin text-heritage-muted" />
                )}
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="rounded p-1 text-heritage-muted hover:text-heritage-ivory"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 border-b border-heritage-border px-3 py-2">
                {(["all", "driver", "team"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs capitalize transition",
                      scope === s
                        ? "bg-heritage-panel text-heritage-ivory"
                        : "text-heritage-muted hover:text-heritage-ivory",
                    )}
                  >
                    {s === "all" ? "All" : `${s}s`}
                  </button>
                ))}
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-heritage-muted">
                  {usedVector ? (
                    <>
                      <Sparkles className="h-3 w-3" /> Semantic
                    </>
                  ) : (
                    <>
                      <Database className="h-3 w-3" /> Local search
                    </>
                  )}
                </span>
              </div>

              <div className="heritage-scroll max-h-[46vh] overflow-y-auto p-2">
                {searched && results.length === 0 && !loading ? (
                  <div className="p-2">
                    <NoSearchResults query={query} />
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {results.map((result) => (
                      <li key={`${result.mode}-${result.id}`}>
                        <button
                          onClick={() => onPick(result)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-heritage-panel"
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: result.entity.primaryColor }}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-heritage-ivory">
                              {result.title}
                            </span>
                            <span className="block truncate text-xs text-heritage-muted">
                              {result.subtitle} · {result.reason}
                            </span>
                          </span>
                          <span className="shrink-0 text-[10px] uppercase text-heritage-muted">
                            {result.mode}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {!searched && !loading && (
                  <p className="px-3 py-6 text-center text-sm text-heritage-muted">
                    Search drivers, teams, eras, and museum artifacts.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
