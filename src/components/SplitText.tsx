"use client";

import { useEffect, useRef, type ElementType } from "react";

import { EASE, gsap, prefersReducedMotion, whenVisible } from "@/lib/motion";

import styles from "./SplitText.module.css";

/**
 * Renders text one glyph at a time and rolls them up into place, each a beat
 * behind the last. The full string stays available to assistive technology as a
 * single label, so it is never announced letter by letter.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const glyphs = element.querySelectorAll(`.${styles.glyph}`);

    if (prefersReducedMotion()) {
      gsap.set(glyphs, { yPercent: 0, opacity: 1 });
      return;
    }

    return whenVisible(() => {
      const context = gsap.context(() => {
        gsap.fromTo(
          glyphs,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: EASE,
            stagger: 0.035,
            delay,
          },
        );
      }, element);

      return () => context.revert();
    });
  }, [text, delay]);

  return (
    <Tag ref={root} className={className} aria-label={text}>
      {[...text].map((character, index) => (
        <span
          // The string is fixed, so position is a stable identity here.
          key={`${character}-${index}`}
          className={styles.mask}
          aria-hidden="true"
        >
          <span className={styles.glyph}>
            {character === " " ? " " : character}
          </span>
        </span>
      ))}
    </Tag>
  );
}
