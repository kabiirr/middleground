import type Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Shared easing, so every movement on the site decelerates the same way. */
export const EASE = "power3.out";

/**
 * Whether the visitor has asked for reduced motion. Checked at call time rather
 * than cached, so a change of system setting is picked up on the next run.
 */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Marks elements as arrived and drops the inline opacity the entrance was
 * writing, so CSS — hover states included — governs them from then on.
 *
 * The order matters: the attribute goes on first. Clearing the inline opacity
 * while the element still counts as unrevealed would expose the hidden start
 * state in globals.css for a frame, and the element would visibly flash out and
 * transition back in.
 */
export function markRevealed(elements: Element[]) {
  elements.forEach((element) => element.setAttribute("data-revealed", ""));
  gsap.set(elements, { clearProps: "opacity" });
}

/**
 * The live Lenis instance, when smooth scrolling is running. Held here so a
 * route change can reset Lenis's own scroll position rather than only the
 * window's — which would leave the two disagreeing — and so the mosaic's
 * infinite loop can shift Lenis's own bookkeeping when it wraps.
 */
export const scroller: { current: Lenis | null } = { current: null };

/**
 * Runs an entrance once the document is actually on screen, and returns a
 * teardown for it.
 *
 * Browsers suspend requestAnimationFrame in a hidden tab, so a timeline started
 * there never advances — content marked for reveal would sit at opacity 0 until
 * the tab was focused. Deferring means a page opened in a background tab plays
 * its entrance properly when the visitor arrives at it.
 */
export function whenVisible(run: () => (() => void) | void) {
  let teardown: (() => void) | void;

  if (document.visibilityState === "visible") {
    teardown = run();
    return () => teardown?.();
  }

  const onVisible = () => {
    if (document.visibilityState !== "visible") return;
    document.removeEventListener("visibilitychange", onVisible);
    teardown = run();
  };

  document.addEventListener("visibilitychange", onVisible);

  return () => {
    document.removeEventListener("visibilitychange", onVisible);
    teardown?.();
  };
}

export { gsap, ScrollTrigger };
