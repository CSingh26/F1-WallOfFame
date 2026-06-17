import { ArchiveX } from "lucide-react";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-heritage-border bg-black/25 p-8 text-center">
      <ArchiveX className="mx-auto h-8 w-8 text-heritage-gold" aria-hidden="true" />
      <h3 className="mt-3 text-lg font-semibold text-heritage-ivory">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-heritage-muted">{message}</p>
    </div>
  );
}
