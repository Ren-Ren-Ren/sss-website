import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects — Studio Stone Soup",
};

const projects = [
  {
    client: "Nette / Sephora",
    title: "Empty Luxury",
    image: "/images/project-nette.svg",
    href: "/projects/nette",
  },
  {
    client: "Location",
    title: "Upper East Side Interior",
    image: "/images/project-ues-interior.svg",
    href: null,
  },
  {
    client: "Location",
    title: "Cary Leeds — Broadcast Push",
    image: "/images/project-cary-leeds.svg",
    href: null,
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <div className={styles.page}>
        <div className={styles.grid}>
          {projects.map((project) =>
            project.href ? (
              <Link href={project.href} className={styles.item} key={project.title}>
                <div className={styles.media}>
                  <img src={project.image} alt="" />
                </div>
                <div className={styles.caption}>
                  <div className={styles.client}>{project.client}</div>
                  <div className={styles.title}>{project.title}</div>
                </div>
              </Link>
            ) : (
              <div className={styles.item} key={project.title}>
                <div className={styles.media}>
                  <img src={project.image} alt="" />
                </div>
                <div className={styles.caption}>
                  <div className={styles.client}>{project.client}</div>
                  <div className={styles.title}>{project.title}</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
