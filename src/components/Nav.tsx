"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ALT_HOME, navItems } from "@/data/site";

import { useNavigation } from "./PageTransition";
import styles from "./Nav.module.css";

export function Nav({
  /**
   * Show only the page you are on, and the rest on hover or focus. Used by the
   * homepage, where the navigation sits inside the fixed panel.
   */
  minimal = false,
}: {
  minimal?: boolean;
} = {}) {
  const pathname = usePathname();
  const { navigate, pending } = useNavigation();

  // The alternate homepage is still the homepage as far as the navigation is
  // concerned — it has no pill of its own, and without this none of the three
  // would be marked, which in the minimised form means none of them are shown.
  const route = pathname === ALT_HOME ? "/" : pathname;

  // While a navigation is in flight the pill for the destination leads the way,
  // so the change of state runs alongside the page transition instead of after.
  // Only the look runs ahead: aria-current keeps telling the truth about where
  // the visitor actually is until the route commits.
  const showing = pending ?? route;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Leave modified clicks and middle clicks to the browser, so opening in a
    // new tab still works.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  return (
    <nav className={minimal ? styles.minimal : undefined} aria-label="Primary">
      <ul className={styles.list}>
        {navItems.map((item) => {
          const isCurrent = item.href === route;
          const isShowing = item.href === showing;

          return (
            <li key={item.href} className={styles.item}>
              <Link
                href={item.href}
                className={styles.pill}
                aria-current={isCurrent ? "page" : undefined}
                data-active={isShowing ? "" : undefined}
                onClick={(event) => handleClick(event, item.href)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
