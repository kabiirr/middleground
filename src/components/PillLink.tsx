"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

import { useNavigation } from "./PageTransition";
import styles from "./PillLink.module.css";

/**
 * A pill that leads somewhere, outside the navigation.
 *
 * Within the site it takes the same route as a nav pill rather than a plain
 * link: clicks play the page you are on out before the push, and the page you
 * are going to back in. A bare `next/link` would cut straight to the new page.
 *
 * Off the site there is no page of our own to play out of, so it is a plain
 * anchor that opens in a new tab and leaves the site where it stands.
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

  const face = `${styles.pill}${className ? ` ${className}` : ""}`;

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        href={href}
        className={face}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={face} onClick={handleClick}>
      {label}
    </Link>
  );
}
