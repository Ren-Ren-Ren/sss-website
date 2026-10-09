import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bodoni_Moda } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, GA_MEASUREMENT_ID } from "@/lib/site";

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

// `title.template` lets every inner page (`app/team/page.tsx`,
// `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`) set just its own
// short `title` string and get " — Studio Stone Soup" appended
// automatically — one place controls the brand suffix instead of every
// page hand-concatenating it (which had drifted to "Stone Soup" in some
// spots and "Studio Stone Soup" in others).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Studio Stone Soup — Creative Production Studio, New York",
    template: "%s — Studio Stone Soup",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Studio Stone Soup — Creative Production Studio, New York",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/images/logo.png", width: 502, height: 502, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Stone Soup — Creative Production Studio, New York",
    description: SITE_DESCRIPTION,
    images: ["/images/logo.png"],
  },
};

// Organization structured data, site-wide (every page shares one entity) —
// tells Google "Studio Stone Soup" is a real organization, not just a
// string of text, and names Weiren Jheng as its founder so a search for
// either name can surface the connection between them. The fuller Person
// entry for Weiren Jheng (jobTitle, affiliation) lives on /team, next to
// the actual bio copy — see app/team/page.tsx.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: SITE_DESCRIPTION,
  email: "contact@stonesoup.info",
  // City-level only, deliberately — the studio has a Google Business
  // Profile with the actual street address (linked below via `sameAs`),
  // but that street address is intentionally not published on the site
  // itself. Don't add `streetAddress` here without checking that's still
  // wanted.
  address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
  sameAs: [
    "https://www.instagram.com/studiostonesoup/",
    "https://maps.app.goo.gl/qaoyhQUtSm1pZdwL7",
  ],
  founder: { "@type": "Person", name: "Weiren Jheng" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${switzer.variable} ${bodoniModa.variable}`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        {/* GA4 — production only, so local dev visits don't pollute the data. */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
