"use client";

import { useEffect } from "react";

import { gsap, prefersReducedMotion, scroller } from "@/lib/motion";

/** Drift per column, as a share of tile height, giving the mosaic depth. */
const COLUMN_DRIFT = [-9, 4, -6, 7, -4];

/**
 * Loops the mosaic endlessly and drifts its columns as it moves.
 *
 * The mosaic is rendered twice, one copy above the other. Once the page has
 * scrolled past the height of a single copy, the scroll position is moved back
 * by exactly that distance: the second copy is then showing what the first was,
 * pixel for pixel, so the jump is invisible and the mosaic reads as continuous.
 *
 * The parallax is measured from each tile's position in the viewport rather than
 * from overall scroll progress. That is what keeps it seamless too — at the
 * wrap, the duplicate tiles sit exactly where the originals were, so they
 * inherit the same offsets instead of snapping to a new value.
 */
export function MosaicScroll() {
  useEffect(() => {
    const copies = Array.from(
      document.querySelectorAll<HTMLElement>("[data-mosaic]"),
    );
    if (copies.length < 2) return;

    const tiles = Array.from(
      document.querySelectorAll<HTMLElement>("[data-mosaic] [data-column]"),
    );

    const setDrift = tiles.map((tile) => gsap.quickSetter(tile, "yPercent"));
    const drift = tiles.map(
      (tile) =>
        COLUMN_DRIFT[Number(tile.dataset.column ?? 0) % COLUMN_DRIFT.length],
    );

    let loopHeight = 0;
    let centres: number[] = [];
    let canParallax = false;

    const measure = () => {
      // The distance between the two passes is the exact period of the
      // pattern, and it is fractional — offsetHeight rounds to whole pixels,
      // which would leave the seam a pixel out.
      const scrollY = window.scrollY;
      loopHeight =
        copies[1].getBoundingClientRect().top -
        copies[0].getBoundingClientRect().top;

      // Layout positions, not rendered ones: offsetTop and offsetHeight ignore
      // the transforms this component applies, so reading them back cannot feed
      // into its own output.
      centres = tiles.map((tile) => {
        const canvas = tile.offsetParent as HTMLElement | null;
        const canvasTop = canvas
          ? canvas.getBoundingClientRect().top + scrollY
          : 0;
        return canvasTop + tile.offsetTop + tile.offsetHeight / 2;
      });

      canParallax =
        window.matchMedia("(min-width: 1200px)").matches &&
        !prefersReducedMotion();
    };

    const wrap = () => {
      // A loop shorter than the window would wrap mid-screen, which would be
      // visible. Better to leave the page as an ordinary one.
      if (loopHeight <= window.innerHeight) return;
      if (window.scrollY < loopHeight) return;

      const lenis = scroller.current;
      if (lenis) {
        // Shifting Lenis's own bookkeeping alongside the window keeps the
        // visitor's momentum: scrollTo would stop the scroll dead at the seam.
        lenis.animatedScroll -= loopHeight;
        lenis.targetScroll -= loopHeight;
        window.scrollTo(0, lenis.animatedScroll);
      } else {
        window.scrollTo(0, window.scrollY - loopHeight);
      }
    };

    const update = () => {
      wrap();
      if (!canParallax) return;

      const scrollY = window.scrollY;
      const middle = window.innerHeight / 2;

      for (let i = 0; i < tiles.length; i += 1) {
        const fromMiddle = centres[i] - scrollY - middle;
        setDrift[i]((drift[i] * fromMiddle) / window.innerHeight);
      }
    };

    measure();
    gsap.ticker.add(update);

    const observer = new ResizeObserver(measure);
    copies.forEach((copy) => observer.observe(copy));
    window.addEventListener("resize", measure);

    return () => {
      gsap.ticker.remove(update);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      gsap.set(tiles, { yPercent: 0 });
    };
  }, []);

  return null;
}
