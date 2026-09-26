"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How far the page has to move before the band answers to it at all. */
const SLOP = 6;

/** And how far down it has to be before the band will go away. */
const CLEAR = 140;

/**
 * A strip that stands aside while you are going down the page, and comes back
 * the moment you turn round.
 *
 * Reading is downwards and the work is what you came for; the way out of the
 * page is only wanted when you are looking for it, and looking for it means
 * heading back up. So it answers to the direction of travel rather than to a
 * position: any upward movement brings it back, wherever you are.
 *
 * It holds still near the top of the page whatever you do, since a strip that
 * vanished in the first few pixels of a scroll would only ever flicker.
 */
export function ShyBand({
  className,
  /** Take part in the page's opening, as the rest of the panel does. */
  intro = false,
  children,
}: {
  className?: string;
  intro?: boolean;
  children: ReactNode;
}) {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = band.current;
    if (!element) return;

    let last = window.scrollY;
    let waiting = false;

    /* One read a frame, however fast the events come. */
    const read = () => {
      waiting = false;
      const y = window.scrollY;
      const moved = y - last;
      // Small movements are the page settling, or a hand resting on it.
      if (Math.abs(moved) < SLOP) return;
      last = y;
      element.toggleAttribute("data-away", moved > 0 && y > CLEAR);
    };

    const onScroll = () => {
      if (waiting) return;
      waiting = true;
      requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={band}
      className={className}
      data-band=""
      data-intro={intro ? "rest" : undefined}
    >
      {children}
    </div>
  );
}
