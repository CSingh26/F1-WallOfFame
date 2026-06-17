"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, GitCompareArrows } from "lucide-react";
import type { HeritageEntity } from "@/lib/f1/types";
import { buildComparison } from "@/lib/f1/stats-aggregator";

interface CompareDockProps {
  entities: HeritageEntity[];
  onRemove: (entity: HeritageEntity) => void;
  onClear: () => void;
}

function nameOf(entity: HeritageEntity): string {
  return entity.mode === "driver" ? entity.name : entity.constructorName;
}

export function CompareDock({ entities, onRemove, onClear }: CompareDockProps) {
  const [a, b] = entities;
  const comparison = a && b ? buildComparison(a, b) : null;

  return (
    <AnimatePresence>
      {entities.length > 0 && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 sm:px-6"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
        >
          <div className="heritage-glass mx-auto max-w-3xl rounded-2xl p-4 shadow-heritage-panel">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 font-display text-sm text-heritage-ivory">
                <GitCompareArrows className="h-4 w-4 heritage-gold-text" />
                Compare ({entities.length}/2)
              </h3>
              <button
                onClick={onClear}
                className="text-xs text-heritage-muted underline-offset-2 hover:text-heritage-ivory hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {entities.map((entity) => (
                <div
                  key={`${entity.mode}-${entity.id}`}
                  className="flex items-center gap-2 rounded-xl border border-heritage-border bg-heritage-panel/50 px-3 py-2"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: entity.primaryColor }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-heritage-ivory">
                    {nameOf(entity)}
                  </span>
                  <button
                    onClick={() => onRemove(entity)}
                    aria-label={`Remove ${nameOf(entity)} from compare`}
                    className="rounded p-1 text-heritage-muted hover:text-heritage-ivory"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {comparison ? (
              <table className="mt-3 w-full text-sm">
                <caption className="sr-only">
                  Comparison between {nameOf(a)} and {nameOf(b)}
                </caption>
                <tbody>
                  {comparison.map((row) => (
                    <tr
                      key={row.label}
                      className="border-t border-heritage-border/60"
                    >
                      <td className="py-1.5 text-right text-heritage-ivory tabular-nums">
                        {row.a}
                      </td>
                      <th
                        scope="row"
                        className="px-3 py-1.5 text-center text-[11px] font-medium uppercase tracking-widest text-heritage-muted"
                      >
                        {row.label}
                      </th>
                      <td className="py-1.5 text-left text-heritage-ivory tabular-nums">
                        {row.b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-3 text-center text-xs text-heritage-muted">
                Add one more entity to see a side-by-side comparison.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
