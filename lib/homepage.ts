import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content/homepage");
const VIDEO_EXT = /\.(mp4|mov)$/i;

// Every video file dropped into content/homepage/ becomes a candidate for
// the hero reel — no naming convention, no code change needed to add or
// remove one. Sorted so the server-rendered default (first item) is
// deterministic; VideoHero picks randomly among these on the client.
export function getHomepageVideos(): string[] {
  const files = fs.readdirSync(DIR).filter((f) => VIDEO_EXT.test(f));
  files.sort();
  return files.map((f) => `/homepage/${encodeURIComponent(f)}`);
}
