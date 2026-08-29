import type { MetadataRoute } from "next";
import { rawProjects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

// Static routes + all 25 case-study routes, generated from the same
// rawProjects list generateStaticParams() uses — so a new project added
// there is automatically picked up here too, no second list to maintain.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/team`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = rawProjects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
