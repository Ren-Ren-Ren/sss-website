// Single source of truth for the production domain — sitemap.ts, robots.ts,
// layout.tsx's metadataBase, and every generateMetadata() that needs an
// absolute URL all read from here instead of hardcoding the domain in
// multiple places.
export const SITE_URL = "https://studiostonesoup.com";
export const SITE_NAME = "Studio Stone Soup";
export const SITE_DESCRIPTION =
  "Studio Stone Soup is a creative production studio based in New York, working across creative direction, photography, motion, and post-production for fashion and beauty brands.";
