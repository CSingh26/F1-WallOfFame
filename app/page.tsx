import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-racing-grid bg-[size:64px_64px] opacity-30" />
      <div className="relative z-10 max-w-2xl animate-fade-up">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-heritage-muted">
          1950 — present
        </p>
        <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl">
          F1 Heritage <span className="heritage-gold-text">Explorer</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-heritage-muted">
          A cinematic Formula 1 museum. Walk the timeline of drivers and teams,
          step into interactive 3D trophy rooms, and discover the eras that
          shaped the championship.
        </p>
        <Link
          href="/f1-heritage"
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-heritage-gold/40 bg-heritage-gold/10 px-6 py-3 text-sm font-medium text-heritage-ivory transition hover:bg-heritage-gold/20"
        >
          Enter the museum
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  );
}
