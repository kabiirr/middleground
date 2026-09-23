"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

import { useNavigation } from "./PageTransition";
import styles from "./PillLink.module.css";

/**
 * A pill that leads somewhere, outside the navigation.
 *
 * It takes the same route as a nav pill rather than a plain link: clicks play
 * the page you are on out before the push, and the page you are going to back
 * in. A bare `next/link` would cut straight to the new page.
 */
export function PillLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const { navigate } = useNavigation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
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
    <Link
      href={href}
      className={`${styles.pill}${className ? ` ${className}` : ""}`}
      onClick={handleClick}
    >
      {label}
    </Link>
  );
}
