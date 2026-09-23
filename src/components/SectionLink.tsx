"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";

import { useNavigation } from "./PageTransition";

/**
 * A whole section that leads somewhere.
 *
 * It takes the same route as a nav pill rather than a plain link: clicks play
 * the page you are on out before the push, and the page you are going to back
 * in. Its accessible name comes from the words inside it, so it is a link with
 * something to read rather than a bare click target laid over the page.
 */
export function SectionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
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
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
