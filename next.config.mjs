/** @type {import('next').NextConfig} */

// public/case-studies and public/homepage are static, hand-placed media —
// safe to cache for a year instead of falling back to whatever default the
// host applies to public/, AS LONG AS an edited file always gets a new
// filename rather than being overwritten in place (see CLAUDE.md's Content
// editing conventions — this is the rule that makes the header below
// safe, added there in the same change as this file). Matters here
// specifically because these files are large (some hero videos are
// 60-100MB); without this, revisits (prev/next, back to /projects) get no
// caching guarantee at all.
const IMMUTABLE_MEDIA_CACHE_CONTROL = "public, max-age=31536000, immutable";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:dir(case-studies|homepage)/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_MEDIA_CACHE_CONTROL }],
      },
    ];
  },
};

export default nextConfig;
