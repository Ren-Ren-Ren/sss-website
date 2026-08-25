import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getProject } from "@/lib/projects";
import { getCaseStudyContent } from "@/content/case-studies";

const project = getProject("22-romer-house-waikiki-janice")!;
const content = getCaseStudyContent(project.dir, project.year);

export const metadata: Metadata = {
  title: [content.title, content.subtitle].filter(Boolean).join(" — ") + " — Stone Soup",
};

export default function Page() {
  return (
    <CaseStudy project={project} content={content} nav={<Nav />} footer={<Footer />} />
  );
}
