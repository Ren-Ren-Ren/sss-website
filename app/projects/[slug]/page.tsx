import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getProject, rawProjects } from "@/lib/projects";
import { getCaseStudyContent } from "@/content/case-studies";

// Replaces 25 near-identical app/projects/<slug>/page.tsx files (each was
// getProject("<slug>")! + getCaseStudyContent + the same metadata/render
// wiring, differing only in the slug literal) with one dynamic route.
// generateStaticParams still fully prerenders all 25 pages at build time —
// same output, one file to maintain instead of 25.
export function generateStaticParams() {
  return rawProjects.map((project) => ({ slug: project.slug }));
}

// Shared by generateMetadata and Page so a missing slug resolves — and
// 404s — exactly one way instead of each hand-rolling its own case.
// cache() also dedupes the two calls Next makes for the same request (one
// for metadata, one for the page) into a single lookup/content read.
const resolveProject = cache((slug: string) => {
  const project = getProject(slug);
  if (!project) return null;
  return { project, content: getCaseStudyContent(project.dir, project.year) };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveProject(slug);
  if (!resolved) notFound();
  const { content } = resolved;
  return {
    title: [content.title, content.subtitle].filter(Boolean).join(" — ") + " — Stone Soup",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = resolveProject(slug);
  if (!resolved) notFound();
  const { project, content } = resolved;

  return (
    // key={project.slug} forces a fresh CaseStudy instance per project on
    // client-side prev/next navigation, rather than relying on the App
    // Router's (undocumented-for-this-case) choice to remount the page
    // subtree on its own when the dynamic segment changes.
    <CaseStudy key={project.slug} project={project} content={content} nav={<Nav />} footer={<Footer />} />
  );
}
