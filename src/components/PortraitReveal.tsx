"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The pixelated frame's own geometry, measured off the file itself: a 960px
 * square whose blocks run 45px, with the grid starting 6px in. The window
 * below is cut to that grid, so what it shows is always whole blocks.
 */
const SOURCE = 960;
const BLOCK = 45;
const PHASE = 6;

/**
 * A second image, shown only where the pointer is.
 *
 * The portrait underneath stays as it is; this holds the pixelated frame over
 * it behind a window that follows the cursor. The window steps block by block
 * rather than gliding: it is the picture's own grid showing through, so a half
 * block would give the game away.
 *
 * The position is written straight onto the element as custom properties
 * rather than held in state — the pointer moves far more often than React
 * should be asked to render, and a mask position is a paint, not a layout.
 */
export function PortraitReveal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    // Nothing to follow where there is no pointer to hover with.
    if (!window.matchMedia("(hover: hover)").matches) return;

    let waiting = false;
    let at = { x: 0, y: 0 };

    /**
     * Where the blocks fall inside the element right now.
     *
     * The frame is filled with `object-fit: cover`, so the picture is scaled
     * to the longer side and the overflow is cropped evenly — the grid's
     * origin moves with that crop, and reading it back is what keeps the
     * window's edges on the block edges rather than near them.
     */
    const grid = () => {
      const box = element.getBoundingClientRect();
      const scale = Math.max(box.width, box.height) / SOURCE;
      const shown = SOURCE * scale;
      return {
        cell: BLOCK * scale,
        x: (box.width - shown) / 2 + PHASE * scale,
        y: (box.height - shown) / 2 + PHASE * scale,
        box,
      };
    };

    const paint = () => {
      waiting = false;
      const { cell, x: originX, y: originY } = grid();
      // The centre of whichever block the pointer is over.
      const column = Math.floor((at.x - originX) / cell);
      const row = Math.floor((at.y - originY) / cell);

      element.style.setProperty("--cell", `${cell}px`);
      element.style.setProperty("--gx", `${originX + (column + 0.5) * cell}px`);
      element.style.setProperty("--gy", `${originY + (row + 0.5) * cell}px`);
    };

    const onMove = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      at = { x: event.clientX - box.left, y: event.clientY - box.top };
      // One write a frame, however fast the pointer reports.
      if (waiting) return;
      waiting = true;
      requestAnimationFrame(paint);
    };

    const onEnter = (event: PointerEvent) => {
      onMove(event);
      // Straight through, so the window is already in place when it opens.
      paint();
      element.setAttribute("data-lit", "");
    };

    const onLeave = () => element.removeAttribute("data-lit");

    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={frame} className={className}>
      {children}
    </div>
  );
}
