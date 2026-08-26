"use client";

import { useEffect, useRef, useState } from "react";

// Shared "has this element scrolled near the viewport" signal, built on the
// same IntersectionObserver pattern Reveal.tsx uses for its fade-in — pulled
// out here so other consumers (media lazy-loading) can reuse the mechanism
// instead of re-implementing it. Left Reveal.tsx's own observer untouched
// (its reduced-motion short-circuit doesn't belong in a general-purpose
// hook, and it's tuned/working code not worth the regression risk).
//
// Pass a module-level constant for `options` — a new object literal on every
// render would re-create the observer every render until `inView` flips true.
export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [inView, options]);

  return { ref, inView };
}
