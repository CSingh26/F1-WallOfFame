import { z } from "zod";

export const modeSchema = z.enum(["driver", "team"]);

export const searchModeSchema = z.enum(["driver", "team", "all"]);

export const searchBodySchema = z.object({
  query: z.string().trim().min(1).max(160),
  mode: searchModeSchema.default("all"),
});

export const syncSecretSchema = z.string().min(8);

export const routeIdSchema = z.string().trim().min(1).max(100);
