import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectsGrid from "@/components/ProjectsGrid";
import { rawProjects } from "@/lib/projects";
import { getCaseStudyContent } from "@/content/case-studies";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects — Studio Stone Soup",
};

export default function ProjectsPage() {
  // Title/subtitle text lives in each project's content.txt (falling back to
  // lib/projects.ts's client/title) so it's editable straight from the
  // project's own folder without touching code.
  const titles = Object.fromEntries(
    rawProjects.map((project) => [
      project.slug,
      getCaseStudyContent(project.dir, project.year),
    ])
  );

  return (
    <>
      <Nav />
      <div className={styles.page}>
        <ProjectsGrid titles={titles} />
      </div>
      <Footer />
    </>
  );
}
