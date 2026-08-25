import type { CSSProperties } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VideoHero from "@/components/VideoHero";
import WorkFeed from "@/components/WorkFeed";
import Reveal from "@/components/Reveal";
import { getHomeContent } from "@/content/pages";
import { getHomepageVideos } from "@/lib/homepage";
import styles from "./page.module.css";

// Renders *word* as an accent-colored span.
function renderLine(text: string) {
  return text.split(/\*(.+?)\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span className={styles.accentWord} key={i}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

// Each statement line is forced onto its own line and never wraps — the
// font-size is sized per line (via the --chars custom property, read in
// CSS) so a long sentence and a short one both fill roughly the same
// share of the viewport width instead of one overflowing or wrapping.
function renderStatement(lines: string[]) {
  return lines.map((line, i) => (
    <span
      className={styles.statementLine}
      key={i}
      style={{ "--chars": line.length } as CSSProperties}
    >
      {renderLine(line)}
    </span>
  ));
}

export default function Home() {
  const home = getHomeContent();
  const videos = getHomepageVideos();

  return (
    <>
      <Nav />

      <div className={styles.hero}>
        <VideoHero videos={videos} />

        <Reveal as="section" className={styles.statement}>
          <div className={`${styles.eyebrow} label`}>{home.eyebrow}</div>
          <p>{renderStatement(home.statement)}</p>
        </Reveal>
      </div>

      <WorkFeed />

      <Footer />
    </>
  );
}
