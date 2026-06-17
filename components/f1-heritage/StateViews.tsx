"use client";

import { Search, AlertTriangle, Inbox } from "lucide-react";

export function EmptyState({
  title = "Nothing to display",
  message = "No entries match the current view yet.",
  icon: Icon = Inbox,
}: {
  title?: string;
  message?: string;
  icon?: typeof Inbox;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-heritage-border bg-heritage-panel/40 px-8 py-16 text-center">
      <Icon className="h-8 w-8 text-heritage-muted" aria-hidden />
      <h3 className="font-display text-lg text-heritage-ivory">{title}</h3>
      <p className="max-w-sm text-sm text-heritage-muted">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something interrupted the broadcast",
  message = "We could not load this section. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-heritage-red/30 bg-heritage-red/5 px-8 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-heritage-red" aria-hidden />
      <h3 className="font-display text-lg text-heritage-ivory">{title}</h3>
      <p className="max-w-sm text-sm text-heritage-muted">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-2 rounded-full border border-heritage-border px-4 py-2 text-sm text-heritage-ivory transition hover:bg-heritage-panel"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No matches found"
      message={`No drivers, teams, or artifacts matched “${query}”. Try a broader query like an era, nationality, or championship theme.`}
    />
  );
}
