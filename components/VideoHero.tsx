"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./VideoHero.module.css";

const COOKIE = "sss_intro_seen";
const HOLD_MS = 500; // how long the fullscreen "SSS" moment holds before shrinking
const TRANSITION_MS = 900;

function hasSeenIntro() {
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
}

export default function VideoHero({ videos }: { videos: string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(videos[0]);
  const [showMark, setShowMark] = useState(false);
  const [growing, setGrowing] = useState(false);

  // Re-roll to a random reel on the client (server always renders the
  // first one, so there's no hydration mismatch) — same pattern as the
  // /projects grid's shuffle.
  useLayoutEffect(() => {
    if (videos.length > 1) {
      setSrc(videos[Math.floor(Math.random() * videos.length)]);
    }
  }, [videos]);

  // The intro: the hero box itself — not a separate overlay — starts
  // pinned over the whole viewport (via a transform computed from its own
  // resting position, so no layout is touched) and animates back down to
  // its real spot. Runs once per browser session.
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || hasSeenIntro()) return;
    document.cookie = `${COOKIE}=1; path=/; samesite=lax`;

    const rect = box.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.max(vw / rect.width, vh / rect.height);
    const tx = vw / 2 - (rect.left + rect.width / 2);
    const ty = vh / 2 - (rect.top + rect.height / 2);

    document.body.classList.add(styles.introLock);
    box.style.zIndex = "150";
    box.style.transition = "none";
    box.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

    setShowMark(true);

    const holdTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        box.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        box.style.transform = "translate(0px, 0px) scale(1)";
        setGrowing(true);
      });
    }, HOLD_MS);

    const cleanupTimer = setTimeout(() => {
      box.style.zIndex = "";
      document.body.classList.remove(styles.introLock);
      setShowMark(false);
    }, HOLD_MS + TRANSITION_MS + 50);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  return (
    <>
      <div ref={boxRef} className={styles.box}>
        <video key={src} src={src} autoPlay muted loop playsInline />
      </div>

      {showMark && (
        <div className={`${styles.introMark} ${growing ? styles.growing : ""}`}>
          <span>SSS</span>
        </div>
      )}
    </>
  );
}
