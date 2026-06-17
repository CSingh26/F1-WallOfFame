"use client";

import { useMemo } from "react";
import type { ImageAsset, ImageKind } from "@/lib/f1/types";
import { fallbackVisual } from "@/lib/f1/image-provider";
import { cn } from "@/lib/f1/utils";

interface EntityVisualProps {
  image: ImageAsset;
  primaryColor: string;
  secondaryColor: string;
  kind?: ImageKind;
  className?: string;
  rounded?: boolean;
  label?: string;
}

/**
 * Renders an approved image when available, otherwise paints a stylized,
 * generated fallback from the entity's colors. No third-party imagery is ever
 * fetched here. Always provides alt text.
 */
export function EntityVisual({
  image,
  primaryColor,
  secondaryColor,
  kind,
  className,
  rounded = true,
  label,
}: EntityVisualProps) {
  const visual = useMemo(
    () => fallbackVisual(kind ?? image.kind, primaryColor, secondaryColor),
    [image.kind, kind, primaryColor, secondaryColor],
  );

  if (image.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.url}
        alt={image.alt}
        width={image.width ?? undefined}
        height={image.height ?? undefined}
        className={cn(
          "h-full w-full object-cover",
          rounded && "rounded-xl",
          className,
        )}
        loading="lazy"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn(
        "relative flex h-full w-full items-end overflow-hidden",
        rounded && "rounded-xl",
        className,
      )}
      style={{ background: visual.background }}
    >
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen bg-carbon"
        aria-hidden
      />
      <FallbackMotif motif={visual.motif} accent={visual.accent} />
      {label ? (
        <span className="relative z-10 m-3 rounded bg-black/40 px-2 py-1 text-[10px] uppercase tracking-widest text-heritage-ivory/80 backdrop-blur">
          {label}
        </span>
      ) : null}
    </div>
  );
}

function FallbackMotif({
  motif,
  accent,
}: {
  motif: string;
  accent: string;
}) {
  // Lightweight inline SVG motifs — purely generated, no external assets.
  const common = "absolute inset-0 h-full w-full";
  switch (motif) {
    case "helmet":
      return (
        <svg className={common} viewBox="0 0 100 100" aria-hidden>
          <path
            d="M20 60 Q20 30 50 30 Q80 30 80 60 L80 66 L40 66 Q34 66 32 60 Z"
            fill={accent}
            opacity="0.85"
          />
          <path d="M40 48 Q55 42 72 50 L72 58 L40 58 Z" fill="#0a0a0b" opacity="0.6" />
        </svg>
      );
    case "livery":
      return (
        <svg className={common} viewBox="0 0 100 100" aria-hidden>
          <rect x="0" y="44" width="100" height="12" fill={accent} opacity="0.9" />
          <rect x="0" y="58" width="100" height="4" fill="#0a0a0b" opacity="0.5" />
        </svg>
      );
    case "trophy":
      return (
        <svg className={common} viewBox="0 0 100 100" aria-hidden>
          <path d="M38 28 H62 V42 Q62 54 50 54 Q38 54 38 42 Z" fill={accent} />
          <rect x="46" y="54" width="8" height="12" fill={accent} />
          <rect x="38" y="66" width="24" height="6" fill={accent} opacity="0.8" />
        </svg>
      );
    case "car":
      return (
        <svg className={common} viewBox="0 0 100 100" aria-hidden>
          <path
            d="M10 60 L26 60 L34 50 L66 50 L74 60 L90 60 L90 66 L10 66 Z"
            fill={accent}
            opacity="0.9"
          />
          <circle cx="30" cy="68" r="6" fill="#0a0a0b" />
          <circle cx="70" cy="68" r="6" fill="#0a0a0b" />
        </svg>
      );
    case "moment":
      return (
        <svg className={common} viewBox="0 0 100 100" aria-hidden>
          <rect
            x="24"
            y="24"
            width="52"
            height="52"
            fill="none"
            stroke={accent}
            strokeWidth="3"
            opacity="0.85"
          />
          <circle cx="50" cy="50" r="10" fill={accent} opacity="0.5" />
        </svg>
      );
    default:
      // silhouette
      return (
        <svg className={common} viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="38" r="14" fill={accent} opacity="0.85" />
          <path
            d="M26 86 Q26 58 50 58 Q74 58 74 86 Z"
            fill={accent}
            opacity="0.75"
          />
        </svg>
      );
  }
}
