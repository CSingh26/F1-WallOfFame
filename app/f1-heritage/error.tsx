"use client";

import { ErrorState } from "@/components/f1-heritage/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="The archive lights flickered"
      message={error.message || "Something went wrong while loading the museum."}
      actionLabel="Reload exhibit"
      onAction={reset}
    />
  );
}
