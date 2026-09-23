"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  EASE,
  gsap,
  markRevealed,
  prefersReducedMotion,
  scroller,
  whenVisible,
} from "@/lib/motion";

import styles from "./PageTransition.module.css";

const OUT_DURATION = 0.26;
const IN_DURATION = 0.42;

/** Safety net if the exit tween never reports back — see navigate(). */
const PUSH_FALLBACK_MS = OUT_DURATION * 1000 + 250;

type Navigation = {
  navigate: (href: string) => void;
  /**
   * The route being travelled to, from the click until it commits. The
   * navigation reads this so it can settle into its new state straight away,
   * rather than waiting out the page transition first.
   */
  pending: string | null;
  /** The element the routed content is rendered into. */
  stage: RefObject<HTMLDivElement | null>;
};

const NavigationContext = createContext<Navigation>({
  navigate: () => {},
  pending: null,
  stage: { current: null },
});

export function useNavigation() {
  return useContext(NavigationContext);
}

/**
 * Owns the route transition and shares it with everything inside.
 *
 * It sits above the navigation as well as the routed content: the navigation
 * has to be able to start a transition and to read where it is heading, and a
 * provider that wrapped only the content would leave it with no way to do
 * either.
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  /** Set while an exit is playing, so only a real route change animates back in. */
  const isLeaving = useRef(false);
  const [pending, setPending] = useState<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;

      // Announced before anything else moves, so the navigation can begin
      // changing shape on the click rather than on arrival.
      setPending(href);

      if (prefersReducedMotion() || !stage.current) {
        router.push(href);
        return;
      }

      // The push is driven by the tween finishing, but must not depend on it:
      // a tween cannot advance while the tab is in the background, and a
      // navigation that never happens is far worse than one that skips its
      // animation.
      let pushed = false;
      const go = () => {
        if (pushed) return;
        pushed = true;
        router.push(href);
      };

      isLeaving.current = true;
      gsap.to(stage.current, {
        autoAlpha: 0,
        duration: OUT_DURATION,
        ease: "power2.inOut",
        onComplete: go,
      });
      window.setTimeout(go, PUSH_FALLBACK_MS);
    },
    [pathname, router],
  );

  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    // The route has arrived; the navigation is already showing it.
    setPending(null);

    if (isLeaving.current) {
      isLeaving.current = false;
      scroller.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);

      gsap.fromTo(
        element,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: IN_DURATION, ease: "power2.out" },
      );
    }

    // Everything marked for reveal starts hidden in CSS. The mosaic runs its
    // own diagonal stagger and parallax, so it is left alone here.
    const targets = gsap.utils
      .toArray<HTMLElement>("[data-reveal]", element)
      .filter((node) => !node.closest("[data-mosaic]"));

    if (targets.length === 0) return;

    if (prefersReducedMotion()) {
      markRevealed(targets);
      return;
    }

    return whenVisible(() => {
      const context = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: EASE,
            stagger: 0.07,
            onComplete: () => markRevealed(targets),
          },
        );
      }, element);

      return () => context.revert();
    });
  }, [pathname]);

  const value = useMemo(
    () => ({ navigate, pending, stage }),
    [navigate, pending],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * The element the routed content is rendered into, and the thing that is
 * actually animated out and back in. It is never hidden up front — the
 * first-load choreography is the reveal system's, which degrades to plain
 * visible content without JS.
 *
 * It fades and nothing more. Moving it would leave a transform behind, and a
 * transformed ancestor becomes the containing block for anything inside it set
 * to `position: fixed` — which would quietly unpin the fixed panel on the
 * homepage. The travel in the transition belongs to the elements
 * themselves, which carry it in their own reveals.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { stage } = useNavigation();

  return (
    <div ref={stage} className={styles.stage}>
      {children}
    </div>
  );
}
