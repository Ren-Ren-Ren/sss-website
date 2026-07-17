// Regenerates the SVG placeholder images in /public/images.
// Run with: npm run placeholders
// To add a new placeholder, add an entry to MANIFEST below and re-run.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "images");

const MANIFEST = [
  { name: "hero-tenniscourt", width: 1800, height: 1200, label: "Homepage Hero" },
  { name: "project-nette", width: 1600, height: 1000, label: "Projects Grid — Nette / Sephora" },
  { name: "project-ues-interior", width: 1600, height: 1000, label: "Projects Grid — UES Interior" },
  { name: "project-cary-leeds", width: 1600, height: 1000, label: "Projects Grid — Cary Leeds" },
  { name: "nette-hero", width: 1920, height: 1080, label: "Nette Case Study — Hero" },
  { name: "nette-grid-01", width: 1600, height: 1000, label: "Nette Grid — 01" },
  { name: "nette-grid-02", width: 900, height: 1100, label: "Nette Grid — 02" },
  { name: "nette-grid-03", width: 900, height: 1100, label: "Nette Grid — 03" },
  { name: "nette-grid-04", width: 1600, height: 900, label: "Nette Grid — 04" },
  { name: "nette-grid-05", width: 900, height: 900, label: "Nette Grid — 05" },
  { name: "nette-grid-06", width: 900, height: 900, label: "Nette Grid — 06" },
];

function placeholderSvg({ name, width, height, label }) {
  const bg = "#ececE4";
  const line = "#d8d5cc";
  const muted = "#8a867d";
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${line}" stroke-width="1"/>
  <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${line}" stroke-width="1"/>
  <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${line}" stroke-width="1"/>
  <text x="50%" y="48%" text-anchor="middle" font-family="monospace" font-size="${Math.max(14, width / 60)}" letter-spacing="2" fill="${muted}">PLACEHOLDER</text>
  <text x="50%" y="54%" text-anchor="middle" font-family="monospace" font-size="${Math.max(11, width / 90)}" fill="${muted}">${label} — ${name}.svg — ${width}×${height}</text>
</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const entry of MANIFEST) {
  const svg = placeholderSvg(entry);
  const outPath = join(OUT_DIR, `${entry.name}.svg`);
  writeFileSync(outPath, svg, "utf8");
  console.log(`wrote ${outPath}`);
}
