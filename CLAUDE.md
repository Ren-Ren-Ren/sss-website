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
- Homepage hero video(s) live in `content/homepage/` — any `.mp4`/`.mov`
  dropped in there becomes a candidate automatically, picked at random per
  visit (`lib/homepage.ts` just scans the directory). No filename
  convention required, no code change needed to add/remove one.
- `/projects` grid order is a *seeded* shuffle (`lib/projects.ts`,
  `seededShuffle`), reshuffling every 5 visits via `localStorage` — not
  genuinely random on every load, by design.

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

- We keep an **icon + wordmark lockup** (pinwheel + "Studio Stone Soup");
  mouthwash's logo is text-only ("MW.S"). Because of this, our wordmark
  needs *more* visual weight (Bold/700) than mouthwash's own logo text
  (which is only weight 400) to balance against the icon's inherent solid
  shape.
- mouthwash's intro loader is a genuine shared-element animation — their
  hero video visually shrinks from fullscreen into its resting position.
  `components/VideoHero.tsx` replicates this for real via a FLIP-style
  transform (measure resting rect, fake it as fullscreen, animate the
  transform away) — this was built to match the literal mechanic, not a
  simplified fade.
- mouthwash's project pages have **no video progress bar or scrub UI at
  all** (confirmed directly: every `<video>` there has `controls: false`,
  no custom scrub element anywhere in the DOM). Ours does — that's a
  deliberate feature we kept, not something adapted from them.
