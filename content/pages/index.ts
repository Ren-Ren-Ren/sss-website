import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content/pages");

function readFile(rel: string) {
  return fs.readFileSync(path.join(DIR, rel), "utf-8").replace(/\r\n/g, "\n");
}

function splitSections(raw: string, headers: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  headers.forEach((h) => (sections[h] = []));
  let current: string | null = null;
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (headers.includes(trimmed)) {
      current = trimmed;
      continue;
    }
    if (current) sections[current].push(line);
  }
  return sections;
}

// Blank-line-separated paragraphs; soft-wrapped lines within a paragraph are joined.
function toParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let buffer: string[] = [];
  for (const line of lines) {
    if (line.trim() === "") {
      if (buffer.length) paragraphs.push(buffer.join(" "));
      buffer = [];
    } else {
      buffer.push(line.trim());
    }
  }
  if (buffer.length) paragraphs.push(buffer.join(" "));
  return paragraphs;
}

// One item per line.
function toListItems(lines: string[]): string[] {
  return lines.map((l) => l.trim()).filter(Boolean);
}

export type HomeContent = { eyebrow: string; statement: string[] };

export function getHomeContent(): HomeContent {
  const sections = splitSections(readFile("home/content.txt"), ["EYEBROW", "STATEMENT"]);
  return {
    eyebrow: toParagraphs(sections.EYEBROW)[0] ?? "",
    // Each line is its own line on the page — not soft-wrapped/joined —
    // so the homepage statement breaks exactly where the file breaks.
    statement: toListItems(sections.STATEMENT),
  };
}

export type TeamContent = {
  intro: string[];
  services: string[];
  clients: string[];
  email: string;
};

export function getTeamContent(): TeamContent {
  const sections = splitSections(readFile("team/content.txt"), [
    "INTRO",
    "SERVICES",
    "CLIENTS",
    "EMAIL",
  ]);
  return {
    intro: toParagraphs(sections.INTRO),
    services: toListItems(sections.SERVICES),
    clients: toListItems(sections.CLIENTS),
    email: toListItems(sections.EMAIL)[0] ?? "",
  };
}

export type NavContent = { tagline: string };

export function getNavContent(): NavContent {
  const sections = splitSections(readFile("shared/nav.txt"), ["TAGLINE"]);
  return { tagline: toParagraphs(sections.TAGLINE)[0] ?? "" };
}

