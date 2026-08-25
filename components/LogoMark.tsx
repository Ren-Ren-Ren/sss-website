"use client";

import { useEffect, useRef } from "react";
import styles from "./LogoMark.module.css";

const DEGREES_PER_PIXEL = 0.5;

export default function LogoMark() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const applyRotation = () => {
      frame = 0;
      if (elRef.current) {
        const scrollTop = document.scrollingElement?.scrollTop ?? window.scrollY;
        const rotation = scrollTop * DEGREES_PER_PIXEL;
        elRef.current.style.transform = `rotate(${rotation}deg)`;
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(applyRotation);
      }
    };

    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={elRef} className={styles.logo} aria-hidden="true" />;
}
