"use client";

import { createElement, useEffect, useRef, useState, type JSX, type ReactNode } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Reveal({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className,
      style: {
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
      },
    },
    children
  );
}
