export type Slide = { src: string; type: "video" | "image" };

// Where the grid thumbnail (the first slide) should stay centered when
// cropped to the grid's aspect ratio. x/y are percentages: 0,0 is the
// top-left of the image, 100,100 is the bottom-right, 50,50 (the default
// when omitted) is dead center.
export type Focal = { x: number; y: number };

export type Project = {
  // Stable URL/route identifier — matches the app/projects/<slug>/ folder
  // and is what links, prev/next, and page params use. Never changes.
  slug: string;
  // The project's folder name on disk — content/case-studies/<dir>/ for
  // content.txt, public/case-studies/<dir>/ for the media itself. Kept
  // separate from `slug` on purpose: media is organized/renamed by hand
  // from time to time (e.g. to something more descriptive), and doing
  // that shouldn't silently break every URL, prev/next link, and route
  // on the site. If a folder gets renamed, update `dir` here — `slug`
  // doesn't need to move.
  dir: string;
  year: string;
  slides: Slide[];
  focal?: Focal;
  // Color for the overlay controls/counter/arrows on the case-study hero —
  // "light" (default) for typically darker/saturated footage, "dark" for
  // predominantly bright/white footage where light text would wash out.
  // A manual per-project setting rather than automatic — the difference-blend
  // trick that would otherwise pick this automatically breaks down on
  // near-uniform bright or dark video (see CaseStudy.module.css).
  overlayTheme?: "light" | "dark";
};

function isVideo(src: string) {
  return /\.(mp4|mov)$/i.test(src);
}

// Every project's media lives in public/case-studies/<dir>/ and is served
// from /case-studies/<dir>/... directly as a static file.
function media(dir: string, filename: string): Slide {
  const src = `/case-studies/${encodeURIComponent(dir)}/${filename}`;
  return { src, type: isVideo(src) ? "video" : "image" };
}

// New work goes at the FRONT of this array, not appended at the end —
// keeps the underlying list current/newest-first for anyone reading this
// file, even though what visitors actually see is shuffled (see
// seededShuffle below — that's a separate, deliberate "different order
// per visitor" mechanic for freshness, unrelated to recency; don't
// conflate the two).
const rawProjects: Project[] = [
  {
    slug: "26-essos",
    dir: "ESSOS",
    year: "2026",
    slides: [media("ESSOS", "hero.mp4")],
  },
  {
    slug: "27-greyson-charleston",
    dir: "Greyson-Charleston",
    year: "2026",
    slides: [
      media("Greyson-Charleston", "hero.jpg"),
      media("Greyson-Charleston", "grid-01.jpg"),
      media("Greyson-Charleston", "grid-02.jpg"),
      media("Greyson-Charleston", "grid-03.jpg"),
      media("Greyson-Charleston", "grid-04.jpg"),
      media("Greyson-Charleston", "grid-05.jpg"),
      media("Greyson-Charleston", "grid-06.jpg"),
    ],
  },
  {
    slug: "28-greyson-harbor-springs",
    dir: "Greyson-Harbor Springs",
    year: "2026",
    slides: [
      media("Greyson-Harbor Springs", "hero.jpg"),
      media("Greyson-Harbor Springs", "grid-01.jpg"),
      media("Greyson-Harbor Springs", "grid-02.jpg"),
      media("Greyson-Harbor Springs", "grid-03.jpg"),
      media("Greyson-Harbor Springs", "grid-04.jpg"),
      media("Greyson-Harbor Springs", "grid-05.jpg"),
      media("Greyson-Harbor Springs", "grid-06.jpg"),
      media("Greyson-Harbor Springs", "grid-07.jpg"),
    ],
  },
  {
    slug: "29-hypebeast-cup-toki-suntory",
    dir: "Hypebeast Cup x Toki Suntory",
    year: "2026",
    slides: [media("Hypebeast Cup x Toki Suntory", "hero.mp4")],
  },
  {
    slug: "30-unnecessary",
    dir: "Unnecessary",
    year: "2026",
    slides: [
      media("Unnecessary", "hero.jpg"),
      media("Unnecessary", "grid-01.jpg"),
      media("Unnecessary", "grid-02.jpg"),
      media("Unnecessary", "grid-03.jpg"),
      media("Unnecessary", "grid-04.jpg"),
      media("Unnecessary", "grid-05.jpg"),
      media("Unnecessary", "grid-06.jpg"),
    ],
  },
  {
    slug: "31-schon-playing-with-fire",
    dir: "schon-playing-with-fire",
    year: "2026",
    slides: [media("schon-playing-with-fire", "hero.mp4")],
  },
  {
    slug: "01-barcode",
    dir: "Barcode",
    year: "2026",
    slides: [
      media("Barcode", "hero.mp4"),
      media("Barcode", "grid-01.jpg"),
      media("Barcode", "grid-02.jpg"),
      media("Barcode", "grid-03.jpg"),
      media("Barcode", "grid-04.jpg"),
    ],
  },
  {
    slug: "02-chloe-shannon",
    dir: "Chloe-Shannon",
    year: "2026",
    slides: [
      media("Chloe-Shannon", "hero.JPG"),
      media("Chloe-Shannon", "grid-01.JPG"),
      media("Chloe-Shannon", "grid-02.JPG"),
      media("Chloe-Shannon", "grid-03.JPG"),
    ],
  },
  {
    slug: "03-edw",
    dir: "EDWONDER- Lifestyle",
    year: "2026",
    slides: [media("EDWONDER- Lifestyle", "hero.mp4")],
  },
  {
    slug: "04-edw-edition-fw24",
    dir: "EDWONDER-FW24",
    year: "2026",
    slides: [
      media("EDWONDER-FW24", "hero.mp4"),
      media("EDWONDER-FW24", "grid-01.jpg"),
      media("EDWONDER-FW24", "grid-02.jpg"),
      media("EDWONDER-FW24", "grid-03.jpg"),
      media("EDWONDER-FW24", "grid-04.jpg"),
      media("EDWONDER-FW24", "grid-05.jpg"),
      media("EDWONDER-FW24", "grid-07.jpg"),
      media("EDWONDER-FW24", "grid-08.jpg"),
      media("EDWONDER-FW24", "grid-09.jpg"),
      media("EDWONDER-FW24", "grid-10.jpg"),
      media("EDWONDER-FW24", "grid-11.jpg"),
      media("EDWONDER-FW24", "grid-12.jpg"),
      media("EDWONDER-FW24", "grid-13.jpg"),
    ],
  },
  {
    slug: "05-gxg-x-vogue",
    dir: "Vogue magazine GXG",
    year: "2026",
    slides: [media("Vogue magazine GXG", "hero.mp4")],
  },
  {
    slug: "06-holden-past-forward",
    dir: "Holden-Past forward",
    year: "2026",
    slides: [
      media("Holden-Past forward", "hero.mp4"),
      media("Holden-Past forward", "grid-01.mp4"),
    ],
  },
  {
    slug: "07-kangol-fw25",
    dir: "Kangol-FW25",
    year: "2026",
    slides: [media("Kangol-FW25", "hero.mp4")],
  },
  {
    slug: "08-kylie-cosmetics-2-0",
    dir: "08-Kylie cosmetics-2.0",
    year: "2026",
    slides: [
      media("08-Kylie cosmetics-2.0", "hero.mp4"),
      media("08-Kylie cosmetics-2.0", "grid-01.mp4"),
      media("08-Kylie cosmetics-2.0", "grid-02.mp4"),
    ],
  },
  {
    slug: "09-kylie-cosmetics-intense",
    dir: "09-Kylie cosmetics-intense",
    year: "2026",
    slides: [
      media("09-Kylie cosmetics-intense", "hero.mov"),
      media("09-Kylie cosmetics-intense", "grid-01.mov"),
      media("09-Kylie cosmetics-intense", "grid-02.mov"),
      media("09-Kylie cosmetics-intense", "grid-03.mov"),
    ],
  },
  {
    slug: "10-met-gala-x-tommy-hilfiger-25",
    dir: "10-Met gala25-Tommy hilfiger",
    year: "2026",
    slides: [
      media("10-Met gala25-Tommy hilfiger", "hero.jpg"),
      media("10-Met gala25-Tommy hilfiger", "grid-01.jpg"),
      media("10-Met gala25-Tommy hilfiger", "grid-02.jpg"),
      media("10-Met gala25-Tommy hilfiger", "grid-03.jpg"),
      media("10-Met gala25-Tommy hilfiger", "grid-04.jpg"),
      media("10-Met gala25-Tommy hilfiger", "grid-05.jpg"),
    ],
  },
  {
    slug: "11-nars",
    dir: "Nars",
    year: "2026",
    slides: [media("Nars", "hero.mp4")],
    overlayTheme: "dark",
  },
  {
    slug: "12-pockets-day",
    dir: "pockets-day",
    year: "2026",
    slides: [
      media("pockets-day", "hero.mp4"),
      media("pockets-day", "grid-01.mp4"),
    ],
  },
  {
    slug: "13-shop-with-google",
    dir: "shop-with-google",
    year: "2026",
    slides: [
      media("shop-with-google", "hero-brown-eyeliner.mp4"),
      media("shop-with-google", "grid-01-cream-blush.mp4"),
      media("shop-with-google", "grid-02-glass-lip-gloss.mp4"),
      media("shop-with-google", "grid-03-signs-bag-charms.mp4"),
    ],
  },
  {
    slug: "14-sealson-prologue",
    dir: "sealson-prologue",
    year: "2026",
    slides: [media("sealson-prologue", "hero.mp4")],
  },
  {
    slug: "15-self-service-magazine",
    dir: "self-service-magazine",
    year: "2026",
    slides: [
      media("self-service-magazine", "hero.mp4"),
      media("self-service-magazine", "grid-01.mp4"),
      media("self-service-magazine", "grid-02.mp4"),
    ],
  },
  {
    slug: "16-silvia-tcherassi",
    dir: "silvia-tcherassi",
    year: "2026",
    slides: [
      media("silvia-tcherassi", "hero.mp4"),
      media("silvia-tcherassi", "grid-01.jpg"),
      media("silvia-tcherassi", "grid-02.jpg"),
      media("silvia-tcherassi", "grid-03.jpg"),
      media("silvia-tcherassi", "grid-04.jpg"),
      media("silvia-tcherassi", "grid-05.jpg"),
      media("silvia-tcherassi", "grid-06.jpg"),
      media("silvia-tcherassi", "grid-07.jpg"),
    ],
  },
  {
    slug: "17-the-cartier-box",
    dir: "the-cartier-box",
    year: "2026",
    slides: [
      media("the-cartier-box", "hero.mp4"),
      media("the-cartier-box", "grid-01.mp4"),
      media("the-cartier-box", "grid-02.mp4"),
    ],
    overlayTheme: "dark",
  },
  {
    slug: "18-topicals-x-sephora",
    dir: "18-Topicals-x-Sephora",
    year: "2026",
    slides: [media("18-Topicals-x-Sephora", "hero.mov")],
  },
  {
    slug: "19-sadia",
    dir: "19-Sidia-MIDAS",
    year: "2026",
    slides: [media("19-Sidia-MIDAS", "hero.jpg")],
  },
  {
    slug: "20-marie-claire-double-chicken-please",
    dir: "20-MarieClaire Magazine-Double Chicken Please",
    year: "2026",
    slides: [
      media("20-MarieClaire Magazine-Double Chicken Please", "hero.jpg"),
      media("20-MarieClaire Magazine-Double Chicken Please", "grid-01.jpg"),
      media("20-MarieClaire Magazine-Double Chicken Please", "grid-02.jpg"),
      media("20-MarieClaire Magazine-Double Chicken Please", "grid-03.jpg"),
      media("20-MarieClaire Magazine-Double Chicken Please", "grid-04.jpg"),
      media("20-MarieClaire Magazine-Double Chicken Please", "grid-05.jpg"),
      media("20-MarieClaire Magazine-Double Chicken Please", "grid-06.jpg"),
    ],
  },
  {
    slug: "21-marie-claire-silver-chang",
    dir: "MarieClaire Magazine-Silver Chang",
    year: "2026",
    slides: [
      media("MarieClaire Magazine-Silver Chang", "hero.jpg"),
      media("MarieClaire Magazine-Silver Chang", "grid-01.jpg"),
      media("MarieClaire Magazine-Silver Chang", "grid-02.jpg"),
      media("MarieClaire Magazine-Silver Chang", "grid-03.jpg"),
    ],
  },
  {
    slug: "22-romer-house-waikiki-janice",
    dir: "Romer house-Janice",
    year: "2026",
    slides: [
      media("Romer house-Janice", "hero.jpg"),
      media("Romer house-Janice", "grid-01.jpg"),
      media("Romer house-Janice", "grid-02.jpg"),
      media("Romer house-Janice", "grid-03.jpg"),
      media("Romer house-Janice", "grid-04.jpg"),
      media("Romer house-Janice", "grid-05.jpg"),
      media("Romer house-Janice", "grid-06.jpg"),
    ],
  },
  {
    slug: "23-salt-and-stone",
    dir: "Salt and Stone-Santal & Vetiver",
    year: "2026",
    slides: [
      media("Salt and Stone-Santal & Vetiver", "hero.jpg"),
      media("Salt and Stone-Santal & Vetiver", "grid-01.jpg"),
      media("Salt and Stone-Santal & Vetiver", "grid-02.jpg"),
      media("Salt and Stone-Santal & Vetiver", "grid-03.jpg"),
    ],
  },
  {
    slug: "24-roku",
    dir: "Roku-Enjoy the best of every season",
    year: "2026",
    slides: [media("Roku-Enjoy the best of every season", "hero.mp4")],
  },
  {
    slug: "25-toki",
    dir: "Toki-A Vibrant Taste Of Japan",
    year: "2026",
    slides: [media("Toki-A Vibrant Taste Of Japan", "hero.mp4")],
  },
];

// Deterministic shuffle: the grid and homepage feed show projects in a
// randomized order (not 01→25) instead of the raw list above, but the
// order stays stable across requests/rebuilds — a fixed seed, not
// Math.random() — so prev/next navigation and the numbered index don't
// flicker between page loads.
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const shuffled = [...items];
  let state = seed;
  const next = () => {
    // mulberry32
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const DEFAULT_SHUFFLE_SEED = 20260822;

export const projects: Project[] = seededShuffle(rawProjects, DEFAULT_SHUFFLE_SEED);

// Exposed so the /projects grid can re-roll the order client-side (see
// ProjectsGrid.tsx) without needing to duplicate the project list.
export { rawProjects };

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { prev, next };
}

export function getType(project: Project) {
  const hasVideo = project.slides.some((s) => s.type === "video");
  const hasImage = project.slides.some((s) => s.type === "image");
  if (hasVideo && hasImage) return "Photography · Video";
  return hasVideo ? "Video" : "Photography";
}
