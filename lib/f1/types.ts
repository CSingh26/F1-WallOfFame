/**
 * Core domain types for the F1 Heritage Explorer.
 * These are the canonical, deterministic shapes used across the app.
 */

export type F1EntityMode = "driver" | "team";

export type EraId =
  | "1950-1958"
  | "1959-1967"
  | "1968-1976"
  | "1977-1988"
  | "1988-1993"
  | "1994-2004"
  | "2005-2013"
  | "2014-2021"
  | "2022-present";

export type ImageKind =
  | "portrait"
  | "helmet"
  | "team-card"
  | "car"
  | "suit"
  | "moment"
  | "fallback";

export type ImageSource =
  | "licensed-manifest"
  | "google-photos"
  | "vercel-blob"
  | "fallback-generated";

export type ImageLicenseStatus = "approved" | "pending" | "fallback";

export interface ImageAsset {
  id: string;
  entityId: string;
  entityMode: F1EntityMode;
  kind: ImageKind;
  url: string | null;
  alt: string;
  source: ImageSource;
  licenseStatus: ImageLicenseStatus;
  credit?: string | null;
  width?: number | null;
  height?: number | null;
}

export type ArtifactType =
  | "trophy"
  | "helmet"
  | "suit"
  | "car"
  | "framed_moment"
  | "season_card";

export type ArtifactImportance = "legendary" | "major" | "standard";

export interface ArtifactDisplayPosition {
  x: number;
  y: number;
  z: number;
}

export interface Artifact {
  id: string;
  entityId: string;
  entityMode: F1EntityMode;
  type: ArtifactType;
  title: string;
  year: number | null;
  description: string;
  importance: ArtifactImportance;
  displayPosition: ArtifactDisplayPosition;
  color: string;
  imageAssetId?: string | null;
  vectorText: string;
}

export interface SourceRef {
  source: "seed" | "jolpica" | "openf1";
  ref: string;
  syncedAt?: string | null;
}

export interface DriverEntity {
  id: string;
  mode: "driver";
  name: string;
  givenName: string;
  familyName: string;
  slug: string;
  nationality: string;
  countryCode: string;
  dateOfBirth: string | null;
  debutYear: number;
  finalYear: number | null;
  active: boolean;
  careerSpanLabel: string;
  championshipYears: number[];
  totalChampionships: number;
  wins: number | null;
  poles: number | null;
  podiums: number | null;
  fastestLaps: number | null;
  entries: number | null;
  teams: string[];
  primaryEra: EraId;
  primaryTeam: string;
  primaryColor: string;
  secondaryColor: string;
  helmetColor: string;
  bio30Words: string;
  longBio: string;
  image: ImageAsset;
  artifacts: Artifact[];
  sourceRefs: SourceRef[];
  updatedAt: string;
}

export interface TeamEntity {
  id: string;
  mode: "team";
  constructorName: string;
  slug: string;
  nationality: string;
  baseCountry: string;
  debutYear: number;
  finalYear: number | null;
  active: boolean;
  activeSeasons: number | null;
  championshipYears: number[];
  totalConstructorsChampionships: number;
  totalDriversChampionshipsLinked: number;
  wins: number | null;
  poles: number | null;
  podiums: number | null;
  primaryColor: string;
  secondaryColor: string;
  liveryStripeColor: string;
  profile30Words: string;
  longProfile: string;
  image: ImageAsset;
  artifacts: Artifact[];
  sourceRefs: SourceRef[];
  updatedAt: string;
}

export type HeritageEntity = DriverEntity | TeamEntity;

export interface EraBand {
  id: EraId;
  label: string;
  startYear: number;
  endYear: number;
  description: string;
  colorHint: string;
}

export interface SearchResult {
  id: string;
  mode: F1EntityMode;
  title: string;
  subtitle: string;
  score: number;
  reason: string;
  entity: HeritageEntity;
  artifact?: Artifact | null;
}

export interface StatsSummary {
  seasonsCovered: number;
  startYear: number;
  currentYear: number;
  driversIndexed: number;
  teamsIndexed: number;
  championshipEras: number;
  artifactsIndexed: number;
}

export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface DataSourceHealth {
  seed: "ok" | "error";
  jolpicaConfigured: boolean;
  openf1Configured: boolean;
  vectorConfigured: boolean;
  appUrlPresent: boolean;
}
