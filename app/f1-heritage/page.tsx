import type { Metadata } from "next";
import { getStats, getEraBands } from "@/lib/f1/repository";
import { F1HeritageApp } from "@/components/f1-heritage/F1HeritageApp";

export const metadata: Metadata = {
  title: "F1 Heritage Explorer",
  description:
    "A cinematic museum of Formula 1 drivers and constructors — explore eras from 1950 to today, step into 3D trophy rooms, and search the heritage of the sport.",
};

export const dynamic = "force-dynamic";

export default function F1HeritagePage() {
  const stats = getStats();
  const eraBands = getEraBands();
  return <F1HeritageApp stats={stats} eraBands={eraBands} />;
}
