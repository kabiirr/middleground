"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Hands its own section over to the pointer.
 *
 * Inside it the cursor is replaced by one of the site's own pills, which
 * carries a light that fills in the outlined letters it passes over. Outside
 * it, nothing: the cursor comes back and the words are as the design draws
 * them.
 *
 * Whether the pointer is inside is measured, not listened for. The events are
 * taken from the window, so nothing laid over the section can swallow them,
 * and a page scrolling under a still cursor is noticed too — the section
 * moves, the pointer does not, and no enter or leave is ever fired.
 *
 * Desktop only. A touch screen has no cursor to replace, and keeps the pill
 * the design draws.
 */
export function Torch({
  className,
  palette,
  parts,
  trail = false,
  children,
}: {
  className?: string;
  /**
   * Fills for the pill to draw from, if it is not to keep one colour. A fresh
   * one is taken on the way in, and again whenever the pointer finds a
   * different part — never the same colour twice running.
   */
  palette?: readonly string[];
  /** What counts as a part: a selector for the pieces worth re-colouring on. */
  parts?: string;
  /**
   * Let the pill follow rather than stick: it runs after the pointer and
   * catches up, instead of standing exactly where the pointer is.
   */
  trail?: boolean;
  children: ReactNode;
}) {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = band.current;
    if (!element) return;

    if (!window.matchMedia("(min-width: 1200px) and (hover: hover)").matches) {
      return;
    }

    // A pill that runs after the pointer is motion for its own sake, so it is
    // the first thing to go when motion is asked to stop.
    const chases =
      trail && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pointer: { x: number; y: number } | null = null;
    /** Where the pointer is, in the band's own space. */
    let mark = { x: 0, y: 0 };
    /** And where the pill is, which is not always the same place. */
    let at = { x: 0, y: 0 };
    let waiting = false;
    let running = 0;
    let lit = false;
    let tone: string | null = null;
    let part: Element | null = null;

    /** A new fill for the pill, never the one it is already wearing. */
    const draw = () => {
      if (!palette?.length) return;
      let next = tone;
      do {
        next = palette[Math.floor(Math.random() * palette.length)];
      } while (palette.length > 1 && next === tone);
      tone = next;
      element.style.setProperty("--pill", next);
    };

    const place = () => {
      element.style.setProperty("--tx", `${at.x}px`);
      element.style.setProperty("--ty", `${at.y}px`);
    };

    /**
     * The chase, a frame at a time: the pill closes a share of whatever is left
     * between it and the pointer, which is a lot at first and less as it
     * arrives, so it runs after the pointer and settles rather than stopping
     * dead. It gives up the frame once there is nothing left to close.
     */
    const CLOSED = 0.18;
    const follow = () => {
      const dx = mark.x - at.x;
      const dy = mark.y - at.y;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        running = 0;
        at = { ...mark };
        place();
        return;
      }
      at = { x: at.x + dx * CLOSED, y: at.y + dy * CLOSED };
      place();
      sense();
      running = requestAnimationFrame(follow);
    };

    /**
     * Which part the pointer has reached, asked of the page rather than
     * listened for: the pill is the cursor here, and the parts are inside a
     * link that would answer for all of them.
     */
    const sense = () => {
      if (!parts || !pointer) return;
      const found =
        document.elementFromPoint(pointer.x, pointer.y)?.closest(parts) ?? null;
      if (found && found !== part) {
        part = found;
        draw();
      }
    };

    /* One write a frame, however fast the pointer reports. */
    const paint = () => {
      waiting = false;
      at = { ...mark };
      place();
      sense();
    };

    const check = () => {
      const box = element.getBoundingClientRect();
      const inside =
        pointer !== null &&
        pointer.x >= box.left &&
        pointer.x <= box.right &&
        pointer.y >= box.top &&
        pointer.y <= box.bottom;

      if (lit !== inside) {
        lit = inside;
        element.toggleAttribute("data-lit", inside);
        // Leaving forgets the part, so coming back is a change like any other.
        part = null;
        if (inside) {
          draw();
          // Arriving, the pill is simply there. A chase from wherever it was
          // last left would be a flight in from off the section.
          if (pointer) {
            at = { x: pointer.x - box.left, y: pointer.y - box.top };
          }
        }
      }

      if (!inside || !pointer) return;

      // The cursor is drawn inside the section, so it is placed in the
      // section's own space rather than the window's.
      mark = { x: pointer.x - box.left, y: pointer.y - box.top };

      if (chases) {
        if (!running) running = requestAnimationFrame(follow);
        return;
      }

      if (waiting) return;
      waiting = true;
      requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      check();
    };

    // The pointer leaving the window altogether gives the cursor back.
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      pointer = null;
      check();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    // The section can arrive under a cursor that never moved.
    window.addEventListener("scroll", check, { passive: true });

    return () => {
      if (running) cancelAnimationFrame(running);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", check);
    };
  }, [palette, parts, trail]);

  return (
    <div ref={band} className={className}>
      {children}
    </div>
  );
}
