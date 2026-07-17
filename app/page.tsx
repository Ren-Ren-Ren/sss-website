import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Nav />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroEyebrow} label`}>
            Production — Creative Direction — Branding / Brooklyn
          </div>
          <h1 className={styles.heroTitle}>
            We build the <em>world</em>
            <br />
            around the image.
          </h1>
          <p className={styles.heroSub}>
            Stone Soup is a creative production house. We plan the shoot,
            direct the story, and shape the brand around it — one team,
            start to finish.
          </p>
        </div>
        <div className={styles.scrollCue}>Scroll</div>
      </section>

      <section className={styles.manifesto}>
        <p>
          We don&apos;t hand off between departments. Studio Stone Soup is{" "}
          <span className={styles.accentWord}>one table</span> — the
          photographer, the producer, the strategist, sitting in the same
          room.
        </p>
      </section>

      <Footer />
    </>
  );
}
