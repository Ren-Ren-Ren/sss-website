# Studio Stone Soup — design system & conventions

This file exists so styling/content decisions stay consistent without being
re-explained every session. Check it before making a visual change, and add
to it when a new convention gets established — treat it as a living record
of *why* things are the way they are, not just what they are.

Primary aesthetic reference: **mouthwash.studio**, deliberately studied and
partially adopted — not copied wholesale. See "Intentional deviations"
below for where and why we diverge.

## Typography

- **Switzer** (self-hosted, `fonts/Switzer-*.woff2`, weights 400/600/700/900)
  is the one grotesk driving everything structural: headline, body copy,
  nav, utility/meta labels, grid/feed titles. Free, open substitute for
  Suisse Int'l (Suisse BP Intl) — the commercial Swiss Typefaces face
  mouthwash actually uses.
- **Bodoni Moda** (Google Fonts, `weight: ["400","600"]`, `style: ["italic"]`
  only) is reserved for exactly one role: the italic accent flourish
  (homepage accent word, grid/feed subtitles, team page manifesto line).
  Free substitute for Suisse Works. **Never used upright** — if a design
  calls for upright serif text, that's a signal to reconsider the design,
  not to re-add Bodoni's normal style.
- In `globals.css`, `--font-sans`, `--font-mono`, and `--font-grotesk` all
  resolve to the same Switzer family now. Keeping three separate variable
  names is deliberate — call sites are keyed to the *role* a font is
  playing (body vs. utility-label vs. display), not to three genuinely
  different typefaces. `--font-serif` resolves to Bodoni Moda italic.
- Font-loading discipline: only load weights actually in use anywhere.
  Before adding a new weight, check whether an existing loaded weight
  already covers the need.
- These CSS var aliases must be declared on `body`, never `:root` — see
  "Known gotchas" below for why.

## Color tokens (`globals.css :root`)

`--bg #f7f7f7` · `--text #171412` · `--muted #8a867d` · `--accent #b08d57`
· `--line #e3e0d9` · `--on-dark #f5f2ea`

## Color hierarchy rule — "label + list" pattern

Anywhere a category **label** sits above a **list of values** — Team
page's Services/Clients, case-study pages' Services/Type/Year/Credits meta
grid — the label is dark (`var(--text)`) and the values are muted
(`var(--muted)`). This is inverted from the more common convention and was
a deliberate choice. **These two spots must stay in sync** — if one
changes, check the other (`app/team/team.module.css` `.heading`/`.list li`
and `components/CaseStudy.module.css` `.metaHeading`/`.metaValue`).

This is a *different* pattern from headline/subhead pairs where the dark
element **is** the primary content itself (grid/feed title+subtitle,
homepage accent word) — there, title stays dark/primary and subtitle stays
muted/secondary. Don't force these two patterns to match each other; they
solve different problems.

## Overlay controls (case-study video hero)

- Slide arrows, play/pause/mute buttons, and the counter (`001 / 003`):
  kept as one consistent "control cluster" — same opacity (`0.5`), same
  font (Switzer, 10.5px, weight 400). If asked to adjust one, ask whether
  the others should match before touching just one.
- `overlayTheme: "light" | "dark"` per project in `lib/projects.ts` is
  **manual**, not automatic — `mix-blend-mode: difference` breaks on
  near-uniform bright/dark backgrounds (proven empirically via A/B
  testing). When adding new hero footage that's mostly one flat bright or
  dark color, check whether it needs `overlayTheme: "dark"`.
- Progress bar: the track's faintness comes from a translucent **color**
  (`color-mix(...)`), never `opacity` on the track element — opacity
  cascades multiplicatively to children, which would wash out the fill
  (the played portion) along with the track. Keep track and fill as
  separate layers, fill always fully opaque.

## Layout philosophy

- **Homepage**: hero video + statement text fit exactly one viewport
  (`.hero { height: 100vh; display:flex; flex-direction:column }`, video
  `flex:1`). This is intentional — don't let it regress into needing a
  scroll to see the statement.
- **Case-study pages**: hero + description + prev/next fit one viewport
  (`100vh`); the Services/Type/Year/Credits meta grid lives below,
  revealed only on scroll.
- **Homepage statement lines never wrap** at normal widths — font-size is
  solved per line from character count (`--chars`, in `page.tsx`) so a
  short and a long line both fill ~91% of viewport width instead of one
  overflowing. Below 560px width this switches to normal wrapping at a
  fixed 22px instead — forcing long copy into one line at phone widths
  makes it illegibly tiny, so the one-line rule has a legibility escape
  hatch on mobile. If copy length changes significantly, re-check both
  breakpoints.

## Content editing (this matters for "where do I change X")

- Every project's TITLE / SUBTITLE / DESCRIPTION / SERVICES / CREDITS /
  YEAR lives in `content/case-studies/<dir>/content.txt` — **the only**
  place to edit that copy. `lib/projects.ts` intentionally has no
  `client`/`title` fields anymore (removed on purpose) — don't reintroduce
  them as a second source of truth for display text.
- A project's folder name (`dir` in `lib/projects.ts`) is decoupled from
  its `slug` (the URL) on purpose — folders can be renamed for your own
  organization without breaking routes, **as long as `dir` gets updated to
  match**. After any folder rename, verify `dir` values against what's
  actually on disk.
- Homepage hero video(s) live in `public/homepage/` — any `.mp4`/`.mov`
  dropped in there becomes a candidate automatically, picked at random per
  visit (`lib/homepage.ts` just scans that directory). No filename
  convention required, no code change needed to add/remove one.
  (`content/homepage/` is a different folder — it only holds a non-served
  README, not video candidates. Easy to mix up; the actual `DIR` constant
  in `lib/homepage.ts` is the source of truth if this ever drifts again.)
- `/projects` grid order is a *seeded* shuffle (`lib/projects.ts`,
  `seededShuffle`), reshuffling every 5 visits via `localStorage` — not
  genuinely random on every load, by design. **This is unrelated to
  recency** — it exists purely so different visitors see a different
  order (freshness), not to surface newest work first. Don't conflate the
  two, and don't "fix" the shuffle in the name of showing new work more.
- **New projects go at the front of the `rawProjects` array** in
  `lib/projects.ts` (not appended at the end) — keeps the underlying list
  itself newest-first/current, for anyone reading the source file, even
  though what visitors see is shuffled per the point above. Slug number
  prefixes (`26-`, `27-`, …) don't need to be renumbered to match array
  position — they're just stable, unique identifiers already baked into
  live URLs; only reorder the array, don't renumber existing slugs to
  "fix" their prefix vs. position.
- Adding a project with its own hero video: **ask each time** whether it
  should also join `public/homepage/`'s hero rotation — don't auto-add it
  and don't decide unasked. That folder is a **separate**, hand-curated
  pool of files from `public/case-studies/<dir>/`, not auto-derived from
  it or "every video project" by default — the original 3 reels were a
  deliberate pick out of many more video projects that exist in
  `public/case-studies/`, not an exhaustive list, so there's no rule to
  infer from precedent. (Confirmed with Ren 2026-08-29: ask per-project,
  every time — this was a deliberate choice, not a default worth
  assuming.)
- Case-study routes are one dynamic file, `app/projects/[slug]/page.tsx`,
  not 25 individual folders — `generateStaticParams()` still prerenders all
  25 at build time, so this is a maintenance simplification, not a behavior
  change. If you ever need per-project overrides beyond what `lib/projects.ts`
  already models (`overlayTheme`, `focal`), they belong as data on `Project`,
  not as a reason to split a project back out into its own route file.
- **Case-study/homepage media files in `public/` are never overwritten in
  place — a re-export or fix always gets a new filename.** This isn't
  optional: `next.config.mjs` sets `Cache-Control: immutable, max-age=1yr`
  on everything under `/case-studies/` and `/homepage/`, so a file replaced
  under its old name will keep serving the stale cached version to any
  visitor (or CDN edge) that already fetched it, for up to a year. Renaming
  the file (and updating the matching `media(...)` call in `lib/projects.ts`,
  or just dropping a new `.mp4` in `public/homepage/`) is the only safe way
  to update hero footage after this cache header was added.

## SEO & discoverability conventions

- **`lib/site.ts` is the one place the production domain
  (`https://studiostonesoup.com`), site name, and default description live**
  — `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`'s `metadataBase`,
  and `app/projects/[slug]/page.tsx`'s `generateMetadata` all import from
  it instead of hardcoding the domain. If the domain ever changes, this is
  the only file to edit.
- **Title template**: `app/layout.tsx`'s `metadata.title.template` is
  `"%s — Studio Stone Soup"`. Every inner page (`app/team/page.tsx`,
  `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`) sets only its
  own short `title` string (e.g. `"Team"`, or a case study's
  `[title, subtitle].join(" — ")`) and lets the layout append the brand
  suffix — don't hand-concatenate `"— Studio Stone Soup"` or `"— Stone
  Soup"` in a page's own `title` again; that's what drifted into
  inconsistent brand strings before this was centralized. The homepage
  itself sets no `title`, so it gets `metadata.title.default` verbatim
  (the one full, keyword-rich string, not run through the template).
- **Founder / personal-name SEO**: `content/pages/team/content.txt`'s
  `FOUNDER` section (parsed by `getTeamContent()` in
  `content/pages/index.ts`) is the one place that names Studio Stone
  Soup's founder — currently `Weiren Jheng — Founder & Creative Director`.
  It drives three things at once: the visible "Founder" block on `/team`
  (`app/team/page.tsx`, styled via `.founderName` in `team.module.css` to
  match the `.emailLink`/Inquiries block next to it), the `Person`
  JSON-LD on that same page, and (by name only) the `founder` field on the
  sitewide `Organization` JSON-LD in `app/layout.tsx`. If the founder's
  name, title, or personal social profiles (`sameAs`) need adding, this is
  the one line to edit — don't duplicate the name as a separate literal
  elsewhere.
- **Structured data (JSON-LD)**: `Organization` schema lives in
  `app/layout.tsx` (site-wide, one entity referenced by every page) is not
  duplicated per-page. `Person` schema for the founder lives only on
  `/team`, next to the actual bio copy, rather than repeated on every
  page — don't add a second `Organization` or `Person` block elsewhere
  without a reason.
- **Alt text**: `components/ThumbnailMedia.tsx` takes an `alt` prop (default
  `""`) — `WorkFeed.tsx` and `ProjectsGrid.tsx` both pass
  `[title, subtitle].filter(Boolean).join(" — ")` from the project's
  content.txt. `CaseStudy.tsx`'s full-bleed slide `<img>` does the same
  with `content.title`/`content.subtitle`. Video elements have no native
  `alt` equivalent, so this only affects image slides/thumbnails — don't
  revert these back to `alt=""`.
- Favicon/app icon: `app/icon.png` and `app/apple-icon.png` are the
  Next.js App Router convention (auto-linked in `<head>`, no manual `<link
  rel="icon">` needed) — currently both are the same file as
  `public/images/logo.png`. If the logo changes, update all three in the
  same change (or drop the two `app/` copies and reintroduce them from the
  new file) — they're intentionally duplicated, not symlinked, so a stale
  favicon after a logo swap is a sign one of the three was missed.

## Performance conventions

- **Grid/feed thumbnails go through `components/ThumbnailMedia.tsx`**, not
  a hand-rolled `<video>`/`<img>` switch — `WorkFeed.tsx` and
  `ProjectsGrid.tsx` both use it. It exists specifically so the ~25 hero
  videos/images on the homepage feed and `/projects` grid aren't all
  fetched/autoplaying on first load: images get native `loading="lazy"`;
  video keeps its real `<video src>` tag in the server-rendered HTML (so a
  crawler or view-source still sees the actual media URL, and there's no
  window where the element doesn't exist in the DOM) but skips `autoPlay`
  and uses `preload="none"` — a shared `useInView` hook
  (`components/useInView.ts`) calls `.play()` once the thumbnail is within
  `rootMargin` of the viewport, which is what actually triggers the fetch.
  Without JS (or before hydration/the observer fires), the video never
  plays, so what's visible is the `.media` container's background color
  (`WorkFeed.module.css`/`projects.module.css`) — not a video frame; that
  background color is load-bearing for this, don't remove it without
  reconsidering this tradeoff. If a future grid/feed needs the same "many
  thumbnails, don't all autoplay at once" behavior, reuse
  `ThumbnailMedia`/`useInView` rather than re-inventing this — an earlier
  version gated the whole
  element behind client-only state instead of just deferring playback, and
  that erased every thumbnail from SSR/SSG output entirely (confirmed via a
  production build: 0 `<img>`/`<video>` tags for both grids). Don't
  reintroduce that shape.
- `components/Reveal.tsx` has its own, separate `IntersectionObserver` for
  its fade-in animation — it does not use `useInView`. That's intentional
  (documented in the hook's own comment): `Reveal`'s observer is tuned,
  working code with a reduced-motion short-circuit `useInView` doesn't
  need, and merging them wasn't worth the regression risk. Don't be
  surprised to find two IntersectionObserver call sites doing conceptually
  similar things — they solve different problems (visibility-gated fade vs.
  visibility-gated media fetch).
- `preload` hints on `<video>` only matter when `autoPlay` is absent —
  browsers override `preload` and buffer eagerly once `autoPlay` is set, so
  don't add a `preload` attribute next to `autoPlay` expecting it to change
  buffering behavior (it won't). `VideoHero.tsx`'s and `CaseStudy.tsx`'s
  hero videos are both `autoPlay`, so neither sets `preload`.

## Known recurring gotchas

- **Turbopack stale-cache renders**: after a multi-file edit or a
  font-loading change, the dev server sometimes shows glitched/stale
  content that the actual code doesn't explain. Don't debug the "bug" —
  stop and restart the dev server first, then re-check.
- **`:root` vs `body` for font var aliases**: a CSS custom property that
  aliases a `next/font` variable (e.g. `--font-sans: var(--font-switzer)`)
  must be declared on `body` or lower, never `:root`. `:root` is `<html>`,
  an *ancestor* of `<body>` (which is what actually carries the
  `next/font`-generated class) — a `var()` reference resolves against the
  scope of the element it's declared on, so at `:root` the referenced
  variable doesn't exist yet, making the alias permanently invalid for
  every descendant. This took the whole site down to browser-default
  serif once already; don't reintroduce it.
- **`opacity` cascades to children**: never use `opacity` for a "faint
  element with a solid child" pattern (e.g. a progress track containing a
  fill) — the child inherits the fade multiplicatively. Use a translucent
  *color* on the parent instead, keep the child's own color fully opaque.

## Workflow — after any styling/content change

1. `npx tsc --noEmit` — must be clean.
2. If the change touches shared layout/CSS, check for sibling instances of
   the same pattern elsewhere (see "label + list" rule above for why this
   matters) before calling it done.
3. Restart the dev server if a screenshot shows something the code can't
   explain — see the Turbopack gotcha above — rather than debugging a
   phantom bug.
4. Full regression sweep before declaring anything finished:
   `curl` status check on `/`, `/projects`, `/team`, and all 25
   `/projects/<slug>` routes. All must 200.
5. Visually verify the actual change in the browser (screenshot or
   computed-style check) — don't infer correctness from the diff alone.
6. When a change establishes a new *convention* (a color rule, a spacing
   rule, an opacity value meant to be shared) rather than a one-off fix,
   add it to this file in the same turn. The doc drifting out of date is
   worse than not having it.

## Intentional deviations from mouthwash.studio

This site studies mouthwash.studio as a reference, not a template:

- We keep an **icon + wordmark lockup** (pinwheel + wordmark); mouthwash's
  logo is text-only ("MW.S"). The wordmark itself is a two-line stack —
  a thin, wide-tracked "Studio" (weight 400, `.wordmark-line1` in
  `globals.css`) sitting above a bold "Stone　Soup" (weight 900,
  `.wordmark-line2`, with a deliberate extra gap between the two words,
  not normal word-spacing) — replacing an earlier single-line "Studio
  Stone Soup" at weight 700. The bold bottom line still carries the
  weight needed to balance against the icon's solid shape; the thin top
  line is new visual contrast that single-line version didn't have.
  `nav .mark`/`.wordmark`/`.wordmark-line1`/`.wordmark-line2` in
  `app/globals.css` are shared, site-wide — every page's `Nav` gets the
  same lockup, not just the homepage.
- `components/VideoHero.tsx`'s intro previously replicated mouthwash's
  loader via a literal FLIP transform (hero video faked fullscreen, then
  shrunk back into its resting box). That's been replaced with a simpler
  mechanic, chosen deliberately over matching mouthwash's exact
  implementation: a solid `var(--bg)`-colored curtain (`.introOverlay` in
  `VideoHero.module.css`) sits over the page, which is already in its
  normal resting layout underneath — hero video already playing in its
  real spot the whole time, nothing scaled or transformed. Sequence: hold
  with "S.S.S" on the curtain (`HOLD_MS`) → curtain and mark fade out
  *together* as one layer (`FADE_MS`), revealing the already-playing video
  and rest of the page at once. `color: var(--text)` on the mark (dark on
  the light curtain) — don't revert to white text, that was for when the
  mark sat over dark video/black, which is no longer the case.
- mouthwash's project pages have **no video progress bar or scrub UI at
  all** (confirmed directly: every `<video>` there has `controls: false`,
  no custom scrub element anywhere in the DOM). Ours does — that's a
  deliberate feature we kept, not something adapted from them.
