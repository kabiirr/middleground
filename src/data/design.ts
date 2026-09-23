/**
 * Canvas constants for the homepage mosaic.
 *
 * The mosaic is hand-placed rather than a uniform grid, so tiles are stored as
 * raw design coordinates. Every dimension is rendered as
 * `calc(<design px> * var(--s))`, where `--s` is a single scale factor defined
 * in page.module.css. At the 1440px design width `--s` is exactly 1, so the
 * page is pixel-identical to Figma; at other widths the whole composition zooms
 * in step, preserving every proportion.
 */

/** Width of the Figma frame, and the width every coordinate is authored against. */
export const CANVAS_WIDTH = 1440;

/**
 * Margin around the mosaic, and the spacing between tiles — the same figure
 * above, below and either side of every piece. Column width falls out of it,
 * so this is the only number to change to open the grid up or close it.
 */
export const GUTTER = 24;

/**
 * Height of the Figma frame "Homepage" (node 2056:2). The frame crops the
 * artwork at 850px; it is kept here only as a reference point, since the live
 * canvas height is derived from the tiles themselves.
 */
export const FIGMA_FRAME_HEIGHT = 850;

/**
 * Width of a column: the canvas less its side margins and the four gaps between
 * columns, divided five ways. Every gap in the mosaic — between columns, between
 * tiles, and at the join where the page loops — is GUTTER.
 */
export const COLUMN_WIDTH = (CANVAS_WIDTH - 2 * GUTTER - 4 * GUTTER) / 5;

/** The five column positions, evenly spaced across the canvas. */
export const COLUMN_X = [0, 1, 2, 3, 4].map(
  (index) => GUTTER + index * (COLUMN_WIDTH + GUTTER),
);

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Turns a design rect into the custom properties the stylesheets position
 * from.
 *
 * Deliberately not `left`/`top`/`width`/`height` themselves: an inline
 * declaration cannot be overridden by a media query, and below the desktop
 * breakpoint the composition has to leave absolute layout altogether. Handing
 * CSS the numbers instead lets it decide what to do with them at each width.
 */
export function toStyle({ x, y, width, height }: Rect) {
  return {
    "--x": x,
    "--y": y,
    "--w": width,
    "--h": height,
  };
}


/** Logo artwork (node 2056:4), at its exported size. */
export const LOGO_SIZE = { width: 84.865, height: 45.2375 };

/** The gap the studio name holds above its tagline. */
export const IDENTITY_GAP = 190;

/** Logotype plus three lines of tagline — everything but the gap between them. */
export const IDENTITY_CONTENT_HEIGHT = LOGO_SIZE.height + 3 * 16 * 1.2;

/**
 * Logo + tagline block, centred in the first screenful.
 *
 * Its height is its contents plus the gap it holds between them, so the block
 * is exactly as tall as what it shows and centring it on the 850px frame
 * centres what you actually see.
 */
const IDENTITY_HEIGHT = IDENTITY_CONTENT_HEIGHT + IDENTITY_GAP;

export const IDENTITY_RECT: Rect = {
  x: COLUMN_X[2],
  y: (FIGMA_FRAME_HEIGHT - IDENTITY_HEIGHT) / 2,
  width: COLUMN_WIDTH,
  height: IDENTITY_HEIGHT,
};

