"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useInView } from "./useInView";
import type { Focal } from "@/lib/projects";

// Shared grid/feed thumbnail renderer — used by both WorkFeed (homepage) and
// ProjectsGrid (/projects) so the two stop hand-rolling the same
// video/image switch.
//
// The <video>/<img> tag itself is ALWAYS part of the markup (server-
// rendered, so a crawler or view-source sees the real media URL, and the
// element exists in the DOM from first paint) — only playback/fetching is
// deferred. Images use the browser's native loading="lazy" (no JS needed).
// Video has no native lazy-load equivalent, so it gets preload="none" and
// no autoPlay; useInView's IntersectionObserver calls .play() itself once
// the thumbnail is `rootMargin` from the viewport, and that call is what
// actually makes the browser start fetching. Without JS, or before that
// observer fires, the video never plays — what's visible is the parent
// `.media` box's background color, not a frame of video (that background
// color is load-bearing for this component, see CLAUDE.md's Performance
// conventions section). (An earlier version gated the whole element behind
// `{inView && ...}`, which kept every thumbnail out of SSR/SSG output
// entirely — confirmed via a production build to leave 0 <img>/<video>
// tags for the 25-item homepage feed and /projects grid. This version
// keeps the same "don't fetch what's off-screen" win without erasing the
// markup crawlers and first paint depend on.)
const OBSERVER_OPTIONS: IntersectionObserverInit = { rootMargin: "200px 0px" };

export default function ThumbnailMedia({
  src,
  type,
  focal,
  alt = "",
}: {
  src: string;
  type: "video" | "image";
  focal?: Focal;
  // Caller-supplied (project title/subtitle) rather than left empty — an
  // image grid of 25 case studies with alt="" on every thumbnail was
  // invisible to image search. No native <video alt> exists, so video
  // thumbnails don't gain anything from this prop, but accept it anyway
  // for a consistent call signature.
  alt?: string;
}) {
  const style = focal ? { objectPosition: `${focal.x}% ${focal.y}%` } : undefined;

  if (type === "image") {
    return <img src={src} alt={alt} loading="lazy" style={style} />;
  }

  return <LazyVideo src={src} style={style} />;
}

function LazyVideo({ src, style }: { src: string; style?: CSSProperties }) {
  const { ref, inView } = useInView<HTMLVideoElement>(OBSERVER_OPTIONS);

  useEffect(() => {
    if (inView) ref.current?.play().catch(() => {});
  }, [inView, ref]);

  return <video ref={ref} src={src} muted loop playsInline preload="none" style={style} />;
}
