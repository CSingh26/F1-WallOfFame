"use client";

import { AlertTriangle } from "lucide-react";

export function ErrorState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-heritage-bg px-4 text-heritage-ivory">
      <section className="max-w-lg rounded-lg border border-heritage-border bg-heritage-panel p-6 shadow-museum">
        <AlertTriangle className="mb-4 h-8 w-8 text-heritage-gold" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-heritage-muted">{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 rounded-md bg-heritage-gold px-4 py-2 text-sm font-semibold text-black outline-none transition hover:bg-[#e4c678] focus-visible:ring-2 focus-visible:ring-heritage-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {actionLabel}
          </button>
        ) : null}
      </section>
    </main>
  );
}
