import type { F1DriverEntity, F1TeamEntity } from "./types";

export function normalizeJolpicaDriver(row: Record<string, unknown>): Partial<F1DriverEntity> {
  const givenName = typeof row.givenName === "string" ? row.givenName : "";
  const familyName = typeof row.familyName === "string" ? row.familyName : "";

  return {
    name: [givenName, familyName].filter(Boolean).join(" "),
    givenName,
    familyName,
    nationality: typeof row.nationality === "string" ? row.nationality : "Data syncing",
    dateOfBirth: typeof row.dateOfBirth === "string" ? row.dateOfBirth : null,
  };
}

export function normalizeJolpicaConstructor(row: Record<string, unknown>): Partial<F1TeamEntity> {
  return {
    constructorName:
      typeof row.name === "string" ? row.name : typeof row.constructorId === "string" ? row.constructorId : "",
    nationality: typeof row.nationality === "string" ? row.nationality : "Data syncing",
  };
}

export function normalizeOpenF1Driver(row: Record<string, unknown>) {
  return {
    driverNumber: row.driver_number,
    broadcastName: row.broadcast_name,
    teamName: row.team_name,
    nameAcronym: row.name_acronym,
    countryCode: row.country_code,
  };
}
