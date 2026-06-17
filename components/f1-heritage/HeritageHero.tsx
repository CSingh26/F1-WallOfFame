"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { F1EntityMode, StatsSummary } from "@/lib/f1/types";
import { ModeToggle } from "./ModeToggle";

interface HeritageHeroProps {
  mode: F1EntityMode;
  onModeChange: (mode: F1EntityMode) => void;
  onOpenSearch: () => void;
  stats: StatsSummary;
}

export function HeritageHero({
  mode,
  onModeChange,
  onOpenSearch,
  stats,
}: HeritageHeroProps) {
  const quickStats = [
    { label: "Seasons covered", value: stats.seasonsCovered },
    { label: "Drivers indexed", value: stats.driversIndexed },
    { label: "Teams indexed", value: stats.teamsIndexed },
    { label: "Championship eras", value: stats.championshipEras },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-heritage-border bg-gradient-to-b from-heritage-panel/60 to-heritage-bg p-6 shadow-heritage-panel sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-racing-grid bg-[size:48px_48px] opacity-20" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.35), transparent 70%)" }}
      />
      <div className="relative">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.4em] text-heritage-muted"
        >
          {stats.startYear} — {stats.currentYear} · The championship archive
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl"
        >
          F1 Heritage <span className="heritage-gold-text">Explorer</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl text-balance text-heritage-muted"
        >
          A cinematic museum of Formula 1. Trace drivers and constructors along a
          living timeline, study their championship years in gold, and step into
          interactive 3D heritage rooms built for every legend.
        </motion.p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ModeToggle mode={mode} onChange={onModeChange} />
          <button
            onClick={onOpenSearch}
            className="group inline-flex items-center gap-3 rounded-full border border-heritage-border bg-heritage-panel/60 px-4 py-2.5 text-sm text-heritage-muted transition hover:border-heritage-gold/40 hover:text-heritage-ivory"
            aria-label="Open heritage search"
          >
            <Search className="h-4 w-4" />
            <span>Search the archive…</span>
            <kbd className="ml-2 rounded border border-heritage-border px-1.5 py-0.5 text-[10px] text-heritage-muted">
              /
            </kbd>
          </button>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-heritage-border bg-heritage-panel/40 px-4 py-3"
            >
              <dt className="text-[11px] uppercase tracking-widest text-heritage-muted">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl text-heritage-ivory">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
