import type { Metadata } from "next";
import { F1HeritageApp } from "@/components/f1-heritage/F1HeritageApp";
import { getEntities, getEraBands, getStatsSummary } from "@/lib/f1/repository";

export const metadata: Metadata = {
  title: "F1 Heritage Explorer | Formula 1 Museum Timeline",
  description:
    "Explore Formula 1 history through a cinematic driver and constructor timeline, placards, search, compare mode, and 3D heritage rooms.",
};

export default function F1HeritagePage() {
  return (
    <F1HeritageApp
      initialDrivers={getEntities("driver")}
      initialTeams={getEntities("team")}
      eraBands={getEraBands()}
      stats={getStatsSummary()}
    />
  );
}
