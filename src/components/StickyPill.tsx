"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Holds a way on at the foot of the screen once the one on the page has gone.
 *
 * It watches the real thing rather than the scroll position: while the pill in
 * the page is in view there is no need for a second, and the moment it leaves
 * the top of the screen this one takes over. Scroll back to it and this one
 * stands down again, so the two are never on screen together.
 *
 * Phones only — the desktop page keeps its panel fixed, and the way on with it.
 */
export function StickyPill({
  watch,
  className,
  children,
}: {
  /** Selector for the pill on the page whose place this one takes. */
  watch: string;
  className?: string;
  children: ReactNode;
}) {
  const held = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = held.current;
    const original = document.querySelector(watch);
    if (!element || !original) return;

    const observer = new IntersectionObserver(
      ([entry]) => element.toggleAttribute("data-shown", !entry.isIntersecting),
      // Any part of it showing counts as still being there.
      { threshold: 0 },
    );
    observer.observe(original);

    return () => observer.disconnect();
  }, [watch]);

  return (
    <div ref={held} className={className}>
      {children}
    </div>
  );
}
