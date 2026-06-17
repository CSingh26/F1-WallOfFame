import { z } from "zod";

export const f1EntityModeSchema = z.enum(["driver", "team"]);
export const searchModeSchema = z.enum(["driver", "team", "all"]);

export const eraIdSchema = z.enum([
  "1950-1958",
  "1959-1967",
  "1968-1976",
  "1977-1988",
  "1988-1993",
  "1994-2004",
  "2005-2013",
  "2014-2021",
  "2022-present",
]);

export const imageKindSchema = z.enum([
  "portrait",
  "helmet",
  "team-card",
  "car",
  "suit",
  "moment",
  "fallback",
]);

export const imageSourceSchema = z.enum([
  "licensed-manifest",
  "google-photos",
  "vercel-blob",
  "fallback-generated",
]);

export const imageLicenseStatusSchema = z.enum([
  "approved",
  "pending",
  "fallback",
]);

export const imageAssetSchema = z.object({
  id: z.string().min(1),
  entityId: z.string().min(1),
  entityMode: f1EntityModeSchema,
  kind: imageKindSchema,
  url: z.string().url().nullable(),
  alt: z.string().min(1),
  source: imageSourceSchema,
  licenseStatus: imageLicenseStatusSchema,
  credit: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
});

export const artifactTypeSchema = z.enum([
  "trophy",
  "helmet",
  "suit",
  "car",
  "framed_moment",
  "season_card",
]);

export const artifactImportanceSchema = z.enum([
  "legendary",
  "major",
  "standard",
]);

export const artifactSchema = z.object({
  id: z.string().min(1),
  entityId: z.string().min(1),
  entityMode: f1EntityModeSchema,
  type: artifactTypeSchema,
  title: z.string().min(1),
  year: z.number().int().nullable(),
  description: z.string().min(1),
  importance: artifactImportanceSchema,
  displayPosition: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  color: z.string().min(1),
  imageAssetId: z.string().nullable().optional(),
  vectorText: z.string().min(1),
});

export const sourceRefSchema = z.object({
  source: z.enum(["seed", "jolpica", "openf1"]),
  ref: z.string().min(1),
  syncedAt: z.string().nullable().optional(),
});

const hexColor = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
  message: "Expected a hex color",
});

export const driverEntitySchema = z.object({
  id: z.string().min(1),
  mode: z.literal("driver"),
  name: z.string().min(1),
  givenName: z.string().min(1),
  familyName: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nationality: z.string().min(1),
  countryCode: z.string().min(2).max(3),
  dateOfBirth: z.string().nullable(),
  debutYear: z.number().int().gte(1950),
  finalYear: z.number().int().nullable(),
  active: z.boolean(),
  careerSpanLabel: z.string().min(1),
  championshipYears: z.array(z.number().int().gte(1950)),
  totalChampionships: z.number().int().gte(0),
  wins: z.number().int().nullable(),
  poles: z.number().int().nullable(),
  podiums: z.number().int().nullable(),
  fastestLaps: z.number().int().nullable(),
  entries: z.number().int().nullable(),
  teams: z.array(z.string()),
  primaryEra: eraIdSchema,
  primaryTeam: z.string().min(1),
  primaryColor: hexColor,
  secondaryColor: hexColor,
  helmetColor: hexColor,
  bio30Words: z.string().min(1),
  longBio: z.string().min(1),
  image: imageAssetSchema,
  artifacts: z.array(artifactSchema),
  sourceRefs: z.array(sourceRefSchema),
  updatedAt: z.string().min(1),
});

export const teamEntitySchema = z.object({
  id: z.string().min(1),
  mode: z.literal("team"),
  constructorName: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nationality: z.string().min(1),
  baseCountry: z.string().min(1),
  debutYear: z.number().int().gte(1950),
  finalYear: z.number().int().nullable(),
  active: z.boolean(),
  activeSeasons: z.number().int().nullable(),
  championshipYears: z.array(z.number().int().gte(1950)),
  totalConstructorsChampionships: z.number().int().gte(0),
  totalDriversChampionshipsLinked: z.number().int().gte(0),
  wins: z.number().int().nullable(),
  poles: z.number().int().nullable(),
  podiums: z.number().int().nullable(),
  primaryColor: hexColor,
  secondaryColor: hexColor,
  liveryStripeColor: hexColor,
  profile30Words: z.string().min(1),
  longProfile: z.string().min(1),
  image: imageAssetSchema,
  artifacts: z.array(artifactSchema),
  sourceRefs: z.array(sourceRefSchema),
  updatedAt: z.string().min(1),
});

export const eraBandSchema = z.object({
  id: eraIdSchema,
  label: z.string().min(1),
  startYear: z.number().int(),
  endYear: z.number().int(),
  description: z.string().min(1),
  colorHint: z.string().min(1),
});

export const searchRequestSchema = z.object({
  query: z.string().trim().min(1, "Query is required").max(200),
  mode: searchModeSchema.default("all"),
});

export const entitiesQuerySchema = z.object({
  mode: f1EntityModeSchema,
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
