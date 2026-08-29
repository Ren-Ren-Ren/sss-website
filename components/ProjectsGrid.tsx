"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ThumbnailMedia from "@/components/ThumbnailMedia";
import {
  projects as defaultOrder,
  rawProjects,
  seededShuffle,
  DEFAULT_SHUFFLE_SEED,
  type Project,
} from "@/lib/projects";
import type { CaseStudyContent } from "@/content/case-studies/types";
import styles from "@/app/projects/projects.module.css";

const STORAGE_SEED = "ss-projects-seed";
const STORAGE_VISITS = "ss-projects-visits";
const RESHUFFLE_EVERY = 5;

export default function ProjectsGrid({
  titles,
}: {
  titles: Record<string, Pick<CaseStudyContent, "title" | "subtitle">>;
}) {
  // Server-rendered order first (matches the static HTML exactly, so no
  // hydration mismatch), then re-rolled on mount per the 5-visit cadence
  // below — same seed as last time for visits 1–4 (so nothing visibly
  // moves), a fresh seed on the 5th (so the grid actually reshuffles).
  const [ordered, setOrdered] = useState<Project[]>(defaultOrder);

  useEffect(() => {
    let seed = Number(localStorage.getItem(STORAGE_SEED));
    let visits = Number(localStorage.getItem(STORAGE_VISITS));
    if (!Number.isFinite(seed) || seed === 0) seed = DEFAULT_SHUFFLE_SEED;
    if (!Number.isFinite(visits) || visits < 0) visits = 0;

    visits += 1;
    if (visits >= RESHUFFLE_EVERY) {
      seed = Math.floor(Math.random() * 1_000_000_000);
      visits = 0;
    }

    localStorage.setItem(STORAGE_SEED, String(seed));
    localStorage.setItem(STORAGE_VISITS, String(visits));

    setOrdered(seed === DEFAULT_SHUFFLE_SEED ? defaultOrder : seededShuffle(rawProjects, seed));
  }, []);

  return (
    <div className={styles.grid}>
      {ordered.map((project) => {
        const hero = project.slides[0];
        // Title/subtitle live only in the project's content.txt — passed
        // in from the server (titles), keyed by slug.
        const title = titles[project.slug]?.title ?? project.slug;
        const subtitle = titles[project.slug]?.subtitle ?? "";
        return (
          <Reveal as="div" key={project.slug}>
            <Link href={`/projects/${project.slug}`} className={styles.item}>
              <div className={styles.media}>
                <ThumbnailMedia
                  src={hero.src}
                  type={hero.type}
                  focal={project.focal}
                  alt={[title, subtitle].filter(Boolean).join(" — ")}
                />
              </div>
              <div className={styles.caption}>
                <span className={styles.title}>{title}</span>
                {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
