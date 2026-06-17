import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { getAppUrl } from "@/lib/f1/env";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "F1 Heritage Explorer",
    template: "%s · F1 Heritage Explorer",
  },
  description:
    "A cinematic Formula 1 museum — explore drivers and teams from the 1950 British Grand Prix to today, with interactive 3D trophy rooms and semantic heritage search.",
  applicationName: "F1 Heritage Explorer",
  keywords: [
    "Formula 1",
    "F1 history",
    "motorsport museum",
    "Grand Prix heritage",
    "racing drivers",
    "constructors",
  ],
  openGraph: {
    title: "F1 Heritage Explorer",
    description:
      "A cinematic Formula 1 museum spanning 1950 to today, with interactive 3D heritage rooms.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
