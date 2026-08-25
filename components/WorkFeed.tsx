import Link from "next/link";
import { projects } from "@/lib/projects";
import { getCaseStudyContent } from "@/content/case-studies";
import Reveal from "@/components/Reveal";
import styles from "./WorkFeed.module.css";

export default function WorkFeed() {
  return (
    <section className={styles.feed}>
      <div className={`${styles.heading} label`}>Selected Work</div>
      {projects.map((project) => {
        const hero = project.slides[0];
        const style = project.focal
          ? { objectPosition: `${project.focal.x}% ${project.focal.y}%` }
          : undefined;
        // Title/subtitle live only in the project's content.txt — one
        // place to edit them, straight from the folder.
        const { title, subtitle } = getCaseStudyContent(project.dir, project.year);
        return (
          <Reveal key={project.slug}>
            <Link href={`/projects/${project.slug}`} className={styles.item}>
              <div className={styles.media}>
                {hero.type === "video" ? (
                  <video src={hero.src} autoPlay muted loop playsInline style={style} />
                ) : (
                  <img src={hero.src} alt="" style={style} />
                )}
              </div>
              <div className={styles.caption}>
                <span className={styles.title}>{title}</span>
                {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
              </div>
            </Link>
          </Reveal>
        );
      })}
    </section>
  );
}
