"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger, prefersReducedMotion, scroller } from "@/lib/motion";

/**
 * Momentum scrolling, driven by GSAP's ticker so there is only ever one
 * requestAnimationFrame loop on the page and ScrollTrigger stays in sync with
 * Lenis rather than reading a stale scroll position.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    scroller.current = lenis;

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(raf);
      lenis.destroy();
      scroller.current = null;
    };
  }, []);

  return null;
}
