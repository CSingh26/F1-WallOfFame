"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/f1-heritage/StateViews";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-16">
      <ErrorState
        title="The exhibit hit a snag"
        message="Something went wrong loading the F1 Heritage Explorer. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
