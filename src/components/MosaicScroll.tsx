"use client";

import { useEffect } from "react";

import { gsap, prefersReducedMotion, scroller } from "@/lib/motion";

/**
 * How far each column rides against the scroll, in design pixels.
 *
 * A column moves as one block. The drift used to be a share of each tile's own
 * height, and since two tiles in a column are rarely the same height, the same
 * share came to different distances and the gutter between them stretched and
 * closed as the page moved. One figure for the whole column leaves every gap in
 * it exactly as the grid set it.
 */
const COLUMN_DRIFT = [-22, 10, -14, 18, -10];

/** Roughly how much scrolling makes a full rise and fall, in pixels. */
const CYCLE = 1300;

/**
 * Loops the mosaic endlessly, and rides its columns against the scroll.
 *
 * The mosaic is rendered twice, one copy above the other. Once the page has
 * scrolled past the height of a single copy, the scroll position is moved back
 * by exactly that distance: the second copy is then showing what the first was,
 * pixel for pixel, so the jump is invisible and the mosaic reads as continuous.
 *
 * The drift has to survive that jump. It is a sine of the scroll position whose
 * period divides the loop a whole number of times, so the offsets at the seam
 * are the same on both sides of it and nothing shifts as the page wraps.
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

    const setDrift = tiles.map((tile) => gsap.quickSetter(tile, "y", "px"));
    const column = tiles.map(
      (tile) => Number(tile.dataset.column ?? 0) % COLUMN_DRIFT.length,
    );

    let loopHeight = 0;
    let period = CYCLE;
    let scale = 1;
    let canDrift = false;

    const measure = () => {
      // The distance between the two passes is the exact period of the
      // pattern, and it is fractional — offsetHeight rounds to whole pixels,
      // which would leave the seam a pixel out.
      loopHeight =
        copies[1].getBoundingClientRect().top -
        copies[0].getBoundingClientRect().top;

      // A whole number of cycles to the loop, so the seam lands mid-stride.
      const cycles = Math.max(1, Math.round(loopHeight / CYCLE));
      period = loopHeight / cycles;

      // The drift is stated in design pixels, like everything else.
      scale = copies[0].getBoundingClientRect().width / 1440;

      canDrift =
        window.matchMedia("(min-width: 1200px)").matches &&
        !prefersReducedMotion();
      if (!canDrift) gsap.set(tiles, { y: 0 });
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
      if (!canDrift) return;

      const phase = (2 * Math.PI * window.scrollY) / period;
      const ride = Math.sin(phase) * scale;

      for (let i = 0; i < tiles.length; i += 1) {
        setDrift[i](COLUMN_DRIFT[column[i]] * ride);
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
      gsap.set(tiles, { y: 0 });
    };
  }, []);

  return null;
}
