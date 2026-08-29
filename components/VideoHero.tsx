"use client";

import { useLayoutEffect, useState } from "react";
import styles from "./VideoHero.module.css";

const COOKIE = "sss_intro_seen";
// How long the white curtain + "S.S.S" hold before starting to fade.
const HOLD_MS = 1600;
// How long the curtain (and the mark, as one layer) takes to fade away —
// the hero video is already playing underneath the whole time, so this is
// also effectively "how long the reveal takes."
const FADE_MS = 900;

function hasSeenIntro() {
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
}

export default function VideoHero({ videos }: { videos: string[] }) {
  const [src, setSrc] = useState(videos[0]);
  const [showIntro, setShowIntro] = useState(false);
  const [fading, setFading] = useState(false);

  // Re-roll to a random reel on the client (server always renders the
  // first one, so there's no hydration mismatch) — same pattern as the
  // /projects grid's shuffle.
  useLayoutEffect(() => {
    if (videos.length > 1) {
      setSrc(videos[Math.floor(Math.random() * videos.length)]);
    }
  }, [videos]);

  // The intro: a solid white curtain over the already-resting page (the
  // hero video is already playing in its normal spot underneath for the
  // whole sequence — nothing here is scaled or transformed). Holds with
  // "S.S.S" on top, then curtain + mark fade out together, revealing the
  // page. Runs once per browser session.
  useLayoutEffect(() => {
    if (hasSeenIntro()) return;
    document.cookie = `${COOKIE}=1; path=/; samesite=lax`;

    document.body.classList.add(styles.introLock);
    setShowIntro(true);

    const holdTimer = setTimeout(() => {
      setFading(true);
    }, HOLD_MS);

    const cleanupTimer = setTimeout(() => {
      document.body.classList.remove(styles.introLock);
      setShowIntro(false);
    }, HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  return (
    <>
      <div className={styles.box}>
        {/* No preload hint here — autoPlay already forces the browser to
            buffer eagerly regardless of what preload says, so a hint would
            be a no-op. Plays from mount, whether or not the intro curtain
            is currently covering it. */}
        <video key={src} src={src} autoPlay muted loop playsInline />
      </div>

      {showIntro && (
        <div className={`${styles.introOverlay} ${fading ? styles.fading : ""}`}>
          <span>S.S.S</span>
        </div>
      )}
    </>
  );
}
