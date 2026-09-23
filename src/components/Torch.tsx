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
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = band.current;
    if (!element) return;

    if (!window.matchMedia("(min-width: 1200px) and (hover: hover)").matches) {
      return;
    }

    let pointer: { x: number; y: number } | null = null;
    let at = { x: 0, y: 0 };
    let waiting = false;
    let lit = false;

    /* One write a frame, however fast the pointer reports. */
    const paint = () => {
      waiting = false;
      element.style.setProperty("--tx", `${at.x}px`);
      element.style.setProperty("--ty", `${at.y}px`);
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
      }

      if (!inside || !pointer) return;

      // The cursor is drawn inside the section, so it is placed in the
      // section's own space rather than the window's.
      at = { x: pointer.x - box.left, y: pointer.y - box.top };
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
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", check);
    };
  }, []);

  return (
    <div ref={band} className={className}>
      {children}
    </div>
  );
}
