# Stone Soup

Next.js (App Router) site for Studio Stone Soup, converted from the original static HTML mockups.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/` — routes. `/` (homepage), `/team`, `/projects` (grid), `/projects/nette` (case study).
- `components/` — shared `Nav`, `Footer`, and the live New York `Clock`.
- `public/images/` — every image on the site, as placeholders. See below.
- `scripts/generate-placeholders.mjs` — regenerates the placeholder SVGs.
- `reference-mockups/` — the original static HTML files, kept for reference only. Not part of the build.

## Swapping in real photos and video

Every image on the site currently points at a placeholder SVG in `public/images/`, named for what it's supposed to be (e.g. `hero-tenniscourt.svg`, `nette-grid-01.svg`). Two ways to replace them:

**Easiest — just drop the file in and ask:** save your photo or video anywhere in `public/images/` (or a new `public/videos/` folder for video), tell me the filename, and I'll point the one line of code at it.

**Self-serve:** save your real file using the *same base name* as the placeholder it replaces, with its real extension (e.g. `hero-tenniscourt.jpg` instead of `.svg`), then update the matching `src="/images/..."` in the page file to the new extension. Current slots:

| File | Used on | Notes |
| --- | --- | --- |
| `hero-tenniscourt.svg` | Homepage hero | Full-bleed background |
| `project-nette.svg` | `/projects` grid | Nette / Sephora |
| `project-ues-interior.svg` | `/projects` grid | UES Interior |
| `project-cary-leeds.svg` | `/projects` grid | Cary Leeds |
| `nette-hero.svg` | Case study | Hero video/image, 16:9 |
| `nette-grid-01.svg` … `06.svg` | Case study | Adjustable media grid — `01`/`04` are full-width, the rest are half-width pairs. Add more entries directly in `app/projects/nette/page.tsx`'s `gridImages` array (and the manifest below) to expand it. |

The hero on the case study is built to hold real video: change its `<img>` to a `<video autoPlay muted loop playsInline>` pointing at your `.mp4` in `app/projects/nette/page.tsx` once you have the file — ask and I'll wire it up.

To add new placeholders (e.g. for a future case study), add an entry to the `MANIFEST` array in `scripts/generate-placeholders.mjs` and run `npm run placeholders`.

## Deploying to Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new), import the GitHub repo.
3. Framework preset is auto-detected as Next.js — no config needed.
4. Deploy. Every push to `main` redeploys automatically.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
