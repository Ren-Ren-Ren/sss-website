"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import Link from "next/link";
import { getAdjacent, getType, type Project } from "@/lib/projects";
import type { CaseStudyContent } from "@/content/case-studies/types";
import styles from "./CaseStudy.module.css";

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export default function CaseStudy({
  project,
  content,
  nav,
  footer,
}: {
  project: Project;
  content: CaseStudyContent;
  nav: ReactNode;
  footer: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  // The video/img is centered and scaled to fit via max-width/max-height,
  // so on a portrait slide (tall/narrow) it's letterboxed inside .mediaBox —
  // .mediaBox itself stays box-shaped (matching the stage), not tight to the
  // visible pixels. This tracks the media's *actual* rendered rect so the
  // controls/arrows overlay can be pinned to the real edges of the image or
  // video instead of drifting into the empty letterboxed margin.
  const [frameRect, setFrameRect] = useState<{ left: number; top: number; width: number; height: number } | null>(
    null
  );

  const slide = project.slides[index];
  const { prev, next } = getAdjacent(project.slug);
  const type = getType(project);

  const isFirstSlide = index === 0;
  const isLastSlide = index === project.slides.length - 1;

  function goPrev() {
    if (isFirstSlide) return;
    setIndex((i) => i - 1);
    setMuted(true);
    setProgress(0);
  }

  function goNext() {
    if (isLastSlide) return;
    setIndex((i) => i + 1);
    setMuted(true);
    setProgress(0);
  }

  function onTimeUpdate(e: SyntheticEvent<HTMLVideoElement>) {
    const video = e.currentTarget;
    if (video.duration) setProgress(video.currentTime / video.duration);
  }

  function seekToClientX(clientX: number, trackEl: HTMLElement) {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = trackEl.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = fraction * video.duration;
    setProgress(fraction);
  }

  // Click-to-seek and drag-to-scrub on the progress bar. Pointer capture
  // keeps move/up events firing on this element even if the cursor leaves
  // it mid-drag, so no window-level listeners are needed.
  function onTrackPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekToClientX(e.clientX, e.currentTarget);
  }

  function onTrackPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.buttons !== 1) return;
    seekToClientX(e.clientX, e.currentTarget);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (project.slides.length < 2) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // goPrev/goNext close over isFirstSlide/isLastSlide, which are derived
    // from `index` — re-subscribing on `index` change keeps those bounds
    // checks current. With `[]` this ran once with index frozen at 0, so
    // ArrowLeft could never fire (isFirstSlide stuck true) and ArrowRight
    // never stopped at the last slide (isLastSlide stuck false), eventually
    // pushing `index` past `project.slides.length - 1` and crashing the
    // render (`project.slides[index]` → undefined).
  }, [index, project.slides.length]);

  useLayoutEffect(() => {
    const box = mediaBoxRef.current;
    if (!box) return;
    const media = box.querySelector("video, img") as HTMLElement | null;
    if (!media) return;

    function measure() {
      if (!box || !media) return;
      const boxRect = box.getBoundingClientRect();
      const mediaRect = media.getBoundingClientRect();
      setFrameRect({
        left: mediaRect.left - boxRect.left,
        top: mediaRect.top - boxRect.top,
        width: mediaRect.width,
        height: mediaRect.height,
      });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(media);
    media.addEventListener("loadedmetadata", measure);
    media.addEventListener("load", measure);
    return () => {
      observer.disconnect();
      media.removeEventListener("loadedmetadata", measure);
      media.removeEventListener("load", measure);
    };
  }, [slide.src]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    // Don't set `playing` here — the video's onPlay/onPause handlers are the
    // source of truth, so the button stays correct even if play()/pause()
    // doesn't do what we expect (e.g. autoplay blocked by the browser).
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <>
      {nav}

      <div className={styles.viewport}>
        <div className={styles.stage}>
          {project.slides.length > 1 && !isFirstSlide && (
            <div className={styles.zoneLeft} onClick={goPrev} />
          )}
          {project.slides.length > 1 && !isLastSlide && (
            <div className={styles.zoneRight} onClick={goNext} />
          )}
          <div
            ref={mediaBoxRef}
            className={`${styles.mediaBox} ${project.overlayTheme === "dark" ? styles.overlayDark : ""}`}
          >
            {slide.type === "video" ? (
              <video
                key={slide.src}
                ref={videoRef}
                src={slide.src}
                autoPlay
                muted={muted}
                loop
                playsInline
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={onTimeUpdate}
              />
            ) : (
              <img
                key={slide.src}
                src={slide.src}
                alt={[content.title, content.subtitle].filter(Boolean).join(" — ")}
              />
            )}

            {/* Pinned to the media's actual rendered rect (frameRect), not
                .mediaBox's — a letterboxed portrait video would otherwise
                leave these drifting into the empty margin around it. */}
            {frameRect && (
              <div className={styles.mediaFrame} style={frameRect}>
                {project.slides.length > 1 && !isFirstSlide && (
                  <button className={`${styles.slideArrow} ${styles.slideArrowLeft}`} onClick={goPrev} aria-label="Previous slide">
                    ←
                  </button>
                )}
                {project.slides.length > 1 && !isLastSlide && (
                  <button className={`${styles.slideArrow} ${styles.slideArrowRight}`} onClick={goNext} aria-label="Next slide">
                    →
                  </button>
                )}

                <div className={styles.overlayBar}>
                  <div className={styles.controls}>
                    {slide.type === "video" && (
                      <>
                        <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
                        <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>
                      </>
                    )}
                  </div>

                  <div
                    className={`${styles.progressTrack} ${slide.type === "video" ? styles.progressTrackActive : ""}`}
                    onPointerDown={slide.type === "video" ? onTrackPointerDown : undefined}
                    onPointerMove={slide.type === "video" ? onTrackPointerMove : undefined}
                  >
                    {slide.type === "video" && (
                      <div className={styles.progressLine}>
                        <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
                      </div>
                    )}
                  </div>

                  <div className={styles.counter}>
                    <span>{pad(index + 1)}</span>
                    <span className={styles.counterTotal}>{pad(project.slides.length)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.info}>
          {content.description && <p className={styles.description}>{content.description}</p>}

          <div className={styles.prevNext}>
            <Link href={`/projects/${prev.slug}`}>← prev</Link>
            <Link href={`/projects/${next.slug}`}>next →</Link>
          </div>
        </div>
      </div>

      <div className={styles.metaSection}>
        <div className={styles.metaGrid}>
          <div className={styles.metaBlock}>
            <div className={styles.metaHeading}>Services</div>
            {content.services.map((service) => (
              <div className={styles.metaValue} key={service}>
                {service}
              </div>
            ))}
          </div>
          <div className={styles.metaBlock}>
            <div className={styles.metaSubgroup}>
              <div className={styles.metaHeading}>Type</div>
              <div className={styles.metaValue}>{type}</div>
            </div>
            <div className={styles.metaSubgroup}>
              <div className={styles.metaHeading}>Year</div>
              <div className={styles.metaValue}>{content.year}</div>
            </div>
          </div>
          <div className={styles.metaBlock}>
            <div className={styles.metaHeading}>Credits</div>
            {content.credits.map((credit) => (
              <div className={styles.metaValue} key={`${credit.role}-${credit.name}`}>
                {credit.role} — {credit.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {footer}
    </>
  );
}
