import fs from "fs";
import path from "path";
import type { CaseStudyContent } from "./types";

const DIR = path.join(process.cwd(), "content/case-studies");

type Section = "TITLE" | "SUBTITLE" | "DESCRIPTION" | "SERVICES" | "CREDITS" | "YEAR";
const HEADERS: Section[] = ["TITLE", "SUBTITLE", "DESCRIPTION", "SERVICES", "CREDITS", "YEAR"];

function parse(raw: string, fallbackYear: string, fallbackTitle: string): CaseStudyContent {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const sections: Record<Section, string[]> = {
    TITLE: [],
    SUBTITLE: [],
    DESCRIPTION: [],
    SERVICES: [],
    CREDITS: [],
    YEAR: [],
  };

  let current: Section | null = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if ((HEADERS as string[]).includes(trimmed)) {
      current = trimmed as Section;
      continue;
    }
    if (current && trimmed) sections[current].push(trimmed);
  }

  // Strip a single wrapping [ ] some content.txt files still have around
  // filled-in values (left over from the "[Name]" placeholder pattern).
  function unbracket(value: string): string {
    const trimmed = value.trim();
    const match = trimmed.match(/^\[([\s\S]*)\]$/);
    return (match ? match[1] : trimmed).trim();
  }

  const credits = sections.CREDITS.map((line) => {
    const i = line.indexOf(":");
    if (i === -1) return { role: line, name: "" };
    return { role: line.slice(0, i).trim(), name: unbracket(line.slice(i + 1)) };
  }).filter((c) => c.name && c.name.toLowerCase() !== "name");

  const rawDescription = sections.DESCRIPTION.join(" ").trim();
  // A description that's still just the bracketed instructional placeholder
  // (e.g. "[Add a 2–3 sentence description...]") hasn't been written yet —
  // show nothing rather than the instructions.
  const description = /^\[[\s\S]*\]$/.test(rawDescription) ? "" : rawDescription;

  return {
    // Title/subtitle live only in this file — TITLE has a fallback (the
    // directory name) so a project is never rendered nameless, but
    // SUBTITLE has none: a project with no subtitle is a valid, deliberate
    // state, not a gap to fill in.
    title: sections.TITLE[0]?.trim() || fallbackTitle,
    subtitle: sections.SUBTITLE[0]?.trim() || "",
    description,
    services: sections.SERVICES,
    credits,
    year: sections.YEAR[0]?.trim() || fallbackYear,
  };
}

// `dir` is the project's actual folder name (see Project.dir in
// lib/projects.ts) — content.txt is the one place that controls what a
// project is titled; `fallbackYear` only covers files written before the
// YEAR section existed, and the title fallback is just the folder name
// itself, so a project is never rendered completely nameless.
//
// Not wrapped in cache() here: every call site (WorkFeed's feed loop, the
// /projects grid loop) passes a different `dir` per call, so there's
// nothing to dedupe at this level. The one place two calls *do* share the
// same `dir` within one render — generateMetadata + Page for the same
// case-study route — is deduped one layer up, in
// app/projects/[slug]/page.tsx's own cache()-wrapped resolver.
export function getCaseStudyContent(dir: string, fallbackYear = ""): CaseStudyContent {
  const raw = fs.readFileSync(path.join(DIR, dir, "content.txt"), "utf-8");
  return parse(raw, fallbackYear, dir);
}
