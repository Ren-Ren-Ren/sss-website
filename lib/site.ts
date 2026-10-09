// Single source of truth for the production domain — sitemap.ts, robots.ts,
// layout.tsx's metadataBase, and every generateMetadata() that needs an
// absolute URL all read from here instead of hardcoding the domain in
// multiple places.
export const SITE_URL = "https://studiostonesoup.com";
export const SITE_NAME = "Studio Stone Soup";
// GA4 Measurement ID — public by design (it's visible in any page's source),
// so it lives here rather than in an env var that would also need setting
// in the hosting dashboard.
export const GA_MEASUREMENT_ID = "G-9FGS91S5YL";
export const SITE_DESCRIPTION =
  "Studio Stone Soup is a creative production studio based in New York, working across creative direction, photography, motion, and post-production for fashion and beauty brands.";
