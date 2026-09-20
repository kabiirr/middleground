"use client";

import { useEffect } from "react";

import {
  EASE,
  gsap,
  markRevealed,
  prefersReducedMotion,
  whenVisible,
} from "@/lib/motion";

/**
 * When the mosaic starts, in seconds — see the timeline below. It overlaps the
 * tail of the opening slightly, so the page never sits still.
 */
export const MOSAIC_DELAY = 1.8;

/** Openings already played this session, so returning does not replay them. */
const played = new Set<string>();

/**
 * A page's opening.
 *
 * The element marked `data-intro="mark"` arrives on its own in the middle of
 * the screen, holds a beat, then travels to its real place; everything marked
 * `data-intro="rest"` follows it in; the artwork comes last, held back by
 * MOSAIC_DELAY.
 *
 * It runs once a session. The navigation is part of it on the homepage, and it
 * lives above the routed content precisely so it can survive a route change —
 * replaying its entrance every time you came back would undo that.
 */
export function Intro({ id }: { id: string }) {
  useEffect(() => {
    const mark = document.querySelector<HTMLElement>('[data-intro="mark"]');
    const rest = gsap.utils.toArray<HTMLElement>('[data-intro="rest"]');
    const everything = [mark, ...rest].filter(Boolean) as HTMLElement[];

    if (everything.length === 0) return;

    if (played.has(id) || prefersReducedMotion() || !mark) {
      markRevealed(everything);
      return;
    }

    played.add(id);

    return whenVisible(() => {
      const context = gsap.context(() => {
        // Where the mark would have to sit to be centred on the screen. Both
        // are viewport coordinates: the page may well be restored part-way
        // down on a reload, and the mark should still fly to the middle of
        // what the visitor is actually looking at.
        const box = mark.getBoundingClientRect();
        const shift = {
          x: window.innerWidth / 2 - box.width / 2 - box.left,
          y: window.innerHeight / 2 - box.height / 2 - box.top,
        };

        gsap
          .timeline({ onComplete: () => markRevealed(everything) })
          .fromTo(
            mark,
            { opacity: 0, scale: 0.7, x: shift.x, y: shift.y },
            { opacity: 1, scale: 1, duration: 0.8, ease: EASE },
          )
          .to(mark, { x: 0, y: 0, duration: 0.8, ease: "power3.inOut" }, "+=0.15")
          .fromTo(
            rest,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: EASE },
            "-=0.3",
          );
      });

      return () => context.revert();
    });
  }, [id]);

  return null;
}
