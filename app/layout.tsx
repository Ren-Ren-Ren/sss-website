import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bodoni_Moda } from "next/font/google";
import "./globals.css";

// Switzer (Fontshare) — a free, open substitute for Suisse Int'l (the
// commercial Swiss Typefaces face Suisse BP Intl), self-hosted here rather
// than pulled from Fontshare's CDN at runtime. This is now the site's one
// grotesk, doing every job — headline, body copy, nav, utility/meta
// labels — the same one-typeface-at-every-size discipline mouthwash.studio
// runs with Suisse BP Intl, instead of splitting those roles across
// separate sans/mono families.
const switzer = localFont({
  src: [
    { path: "../fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Switzer-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Switzer-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

// A free, open substitute for Suisse Works (the commercial Swiss Typefaces
// serif) — reserved purely for the one italic accent moment (homepage
// flourish word, grid/feed subtitles, team manifesto line), mirroring how
// rarely mouthwash's own Suisse Works actually shows up. Italic-only —
// nothing on the site uses it upright anymore.
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["italic"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stone Soup",
  description:
    "Stone Soup is a creative production house. We plan the shoot, direct the story, and shape the brand around it — one team, start to finish.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${switzer.variable} ${bodoniModa.variable}`}>{children}</body>
    </html>
  );
}
