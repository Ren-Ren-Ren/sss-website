import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./case-study.module.css";

export const metadata: Metadata = {
  title: "Nette — Empty Luxury — Stone Soup",
};

const metaBlocks: { heading: string; value: string | string[] }[] = [
  { heading: "Client", value: "Nette (Sephora)" },
  { heading: "Year", value: "2026" },
  { heading: "Services", value: ["Creative Direction", "Production", "Post-Production"] },
  { heading: "Type", value: "Photography · Video" },
  { heading: "Locations", value: ["Cary Leeds Center", "Upper East Side", "Private Residence, NYC"] },
  { heading: "Credits", value: ["Production & Creative Direction — Stone Soup LLC", "Producer — Sissi"] },
];

const gridImages = [
  { src: "/images/nette-grid-01.svg", full: true },
  { src: "/images/nette-grid-02.svg", full: false },
  { src: "/images/nette-grid-03.svg", full: false },
  { src: "/images/nette-grid-04.svg", full: true },
  { src: "/images/nette-grid-05.svg", full: false },
  { src: "/images/nette-grid-06.svg", full: false },
];

export default function NetteCaseStudy() {
  return (
    <>
      <Nav />

      <div className={styles.heroWrap}>
        <div className={styles.hero}>
          <img src="/images/nette-hero.svg" alt="" />
          <div className={styles.heroControls}>
            <span>Play</span>
            <span>Unmute</span>
            <span>00:00 / 00:24</span>
          </div>
          <div className={styles.heroCount}>001 / {String(gridImages.length + 1).padStart(3, "0")}</div>
        </div>
      </div>

      <div className={styles.intro}>
        <p>
          Stone Soup Originals is our own lens turned outward — stories,
          locations, and campaigns we produce because they&apos;re worth
          telling, not just because a client asked.
        </p>
        <p>
          Nette came to us with a fragrance and a feeling: luxury that
          doesn&apos;t announce itself. Three locations, thirty stills, and
          three social videos, shot lean across two days in New York.
        </p>
      </div>

      <div className={styles.meta}>
        {metaBlocks.map((block) => (
          <div className={styles.metaBlock} key={block.heading}>
            <div className={styles.metaHeading}>{block.heading}</div>
            {Array.isArray(block.value) ? (
              block.value.map((line) => <div key={line}>{line}</div>)
            ) : (
              <div>{block.value}</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {gridImages.map((img) => (
          <div
            className={`${styles.gridItem} ${img.full ? styles.gridItemFull : ""}`}
            key={img.src}
          >
            <img src={img.src} alt="" />
          </div>
        ))}
      </div>

      <div className={styles.prevNext}>
        <a href="/projects">← All Projects</a>
        <a href="/projects">Next Project →</a>
      </div>

      <Footer />
    </>
  );
}
