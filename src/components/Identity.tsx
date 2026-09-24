import type { CSSProperties } from "react";

import { LOGO_SIZE, toStyle } from "@/data/design";
import {
  IDENTITY_HEIGHT,
  identityPlace,
  identityRect,
} from "@/data/projects";
import { site } from "@/data/site";

import styles from "./Identity.module.css";

/**
 * The studio's name and what it does.
 *
 * In its `roaming` form it carries no position of its own — IdentityRelay moves
 * it around the grid so that it is never far out of reach as the page scrolls.
 * That copy repeats what the fixed one already says, so it is kept out of the
 * accessibility tree.
 */
export function Identity({
  roaming = false,
  /**
   * Take part in the page's opening. Only the first pass of the mosaic does:
   * the second exists to make the loop seamless, and its copy sits far below
   * the fold, so it is simply there from the start.
   */
  intro = false,
}: {
  roaming?: boolean;
  intro?: boolean;
}) {
  // The roaming copy is positioned by IdentityRelay; the fixed one by the design.
  const style = roaming
    ? undefined
    : ({
        ...toStyle(identityRect, identityPlace),
        // The part of its height that grows, the caption band aside.
        "--art": IDENTITY_HEIGHT,
      } as CSSProperties);

  return (
    <div
      className={roaming ? styles.roaming : styles.identity}
      style={style}
      data-roaming={roaming ? "" : undefined}
      aria-hidden={roaming ? true : undefined}
    >
      {/*
        The logo is outlined artwork exported from Figma, so it needs no webfont
        and stays crisp at any scale. A plain <img> keeps its intrinsic size —
        next/image would not optimise an SVG anyway.

        It also leads the homepage's opening: the logotype flies in and settles,
        then the line follows. The roaming copy takes no part in that.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.logo}
        src="/logo.svg"
        alt={`${site.name} — brand design studio`}
        width={LOGO_SIZE.width}
        height={LOGO_SIZE.height}
        data-intro={intro ? "mark" : undefined}
      />
      <p className={styles.tagline} data-intro={intro ? "rest" : undefined}>
        {site.tagline}
      </p>
    </div>
  );
}
