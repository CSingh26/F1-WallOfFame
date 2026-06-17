export type F1EntityMode = "driver" | "team";

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

export type LicenseStatus = "approved" | "pending" | "fallback";

export type ArtifactType =
  | "trophy"
  | "helmet"
  | "suit"
  | "car"
  | "framed_moment"
  | "season_card";

export type ArtifactImportance = "legendary" | "major" | "standard";

export type NullableStat = number | null;

export interface ImageAsset {
  id: string;
  entityId: string;
  entityMode: F1EntityMode;
  kind: ImageKind;
  url: string | null;
  alt: string;
  source: ImageSource;
  licenseStatus: LicenseStatus;
  credit?: string;
  width?: number;
  height?: number;
}

export interface HeritageArtifact {
  id: string;
  entityId: string;
  entityMode: F1EntityMode;
  type: ArtifactType;
  title: string;
  year: number | null;
  description: string;
  importance: ArtifactImportance;
  displayPosition: [number, number, number];
  color: string;
  imageAssetId?: string;
  vectorText: string;
}

export interface EraBand {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  description: string;
  colorHint: string;
}

interface BaseEntity {
  id: string;
  mode: F1EntityMode;
  slug: string;
  nationality: string;
  debutYear: number;
  finalYear: number | null;
  active: boolean;
  championshipYears: number[];
  wins: NullableStat;
  poles: NullableStat;
  podiums: NullableStat;
  primaryColor: string;
  secondaryColor: string;
  image: ImageAsset;
  artifactIds: string[];
  sourceRefs: string[];
  updatedAt: string;
}

export interface F1DriverEntity extends BaseEntity {
  mode: "driver";
  name: string;
  givenName: string;
  familyName: string;
  countryCode: string;
  dateOfBirth: string | null;
  careerSpanLabel: string;
  totalChampionships: number;
  fastestLaps: NullableStat;
  entries: NullableStat;
  teams: string[];
  primaryEra: string;
  primaryTeam: string;
  helmetColor: string;
  bio30Words: string;
  longBio: string;
}

export interface F1TeamEntity extends BaseEntity {
  mode: "team";
  constructorName: string;
  baseCountry: string;
  activeSeasons: number | null;
  totalConstructorsChampionships: number;
  totalDriversChampionshipsLinked: number | null;
  liveryStripeColor: string;
  profile30Words: string;
  longProfile: string;
}

export type F1Entity = F1DriverEntity | F1TeamEntity;

export type HydratedF1Entity<T extends F1Entity = F1Entity> = T & {
  artifacts: HeritageArtifact[];
};

export interface SearchResult {
  id: string;
  mode: F1EntityMode;
  title: string;
  subtitle: string;
  score: number;
  reason: string;
  entity: HydratedF1Entity;
  artifact?: HeritageArtifact;
}

export interface HeritageStatsSummary {
  seasonsCovered: number;
  driversIndexed: number;
  teamsIndexed: number;
  championshipEras: number;
  currentYear: number;
}

export interface ProviderHealth {
  seed: "ready";
  jolpicaConfigured: boolean;
  openF1Configured: boolean;
  vectorConfigured: boolean;
  appUrlPresent: boolean;
}

export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
