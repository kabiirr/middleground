import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { COLUMN_X, toStyle } from "@/data/design";
import {
  CAPTION,
  COLUMN_METRICS,
  TITLE_BAND,
  tiles,
  type Tile,
} from "@/data/projects";

import { ArtworkProvider, ArtworkTrigger } from "./ArtworkView";
import { Identity } from "./Identity";
import { MosaicMotion } from "./MosaicMotion";
import { IdentityRelay } from "./IdentityRelay";
import { MosaicScroll } from "./MosaicScroll";
import { TileVideo } from "./TileVideo";
import styles from "./Mosaic.module.css";

/**
 * Sizes hint for the responsive image loader: one fifth of the viewport on the
 * desktop mosaic, widening as it drops to three columns and then two.
 */
const IMAGE_SIZES =
  "(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 20vw";

/** Tiles on the first screen are worth fetching eagerly; the rest are not. */
const ABOVE_THE_FOLD = 5;

/** Which of the five design columns a tile sits in. */
/**
 * How tall the canvas has to be: as deep as the deepest column.
 *
 * Each column's depth is written out in the three parts a height is made of —
 * the gutters and the caption bands, which hold their size however wide the
 * screen, and the artwork between them, which grows with it. Since they scale
 * differently, which column is deepest could change with the width, so the
 * maximum is taken in CSS rather than settled here at one width.
 */
const CANVAS_HEIGHT = `max(${COLUMN_METRICS.map(
  ({ gaps, bands, stacked }) =>
    `calc(${gaps} * var(--gap) + ${bands} * var(--band) + ${stacked} * var(--u))`,
).join(", ")})`;

function columnOf(tile: Tile) {
  return COLUMN_X.reduce(
    (best, x, index) =>
      Math.abs(x - tile.rect.x) < Math.abs(COLUMN_X[best] - tile.rect.x)
        ? index
        : best,
    0,
  );
}

/** The artwork, cropped to the frame the grid gives it. */
function TileArtwork({ tile, priority }: { tile: Tile; priority: boolean }) {
  const { media } = tile;

  // No artwork supplied yet — the frame stays the grey placeholder from Figma.
  if (!media) return null;

  return media.kind === "video" ? (
    <TileVideo className={styles.media} src={media.src} poster={media.poster} />
  ) : (
    <Image
      className={styles.media}
      src={media.src}
      alt={tile.alt ?? ""}
      fill
      sizes={IMAGE_SIZES}
      priority={priority}
    />
  );
}

function MosaicTile({
  tile,
  priority,
  reveal,
  interactive,
}: {
  tile: Tile;
  priority: boolean;
  reveal: boolean;
  /** The duplicate pass is scenery; only the first pass answers to anything. */
  interactive: boolean;
}) {
  const style = {
    ...toStyle(tile.rect, tile.place),
    // The artwork's own proportions, which is the tile less the band its title
    // stands in. Used where the tiles flow rather than being placed.
    "--tile-ratio": `${tile.rect.width} / ${tile.rect.height - TITLE_BAND}`,
    // And how much of the tile is artwork, which is the part that grows.
    "--art": tile.rect.height - TITLE_BAND,
  } as CSSProperties;

  const inside = (
    <>
      <span className={styles.frame}>
        <TileArtwork tile={tile} priority={priority} />
      </span>
      {tile.title ? (
        <span className={styles.caption}>
          <span className={styles.name}>{tile.title}</span>
          {tile.note ? <span className={styles.note}>{tile.note}</span> : null}
        </span>
      ) : null}
    </>
  );

  return (
    <div
      className={styles.tile}
      style={style}
      data-node-id={tile.node}
      data-tile={tile.id}
      data-column={columnOf(tile)}
      // Only the first pass plays the entrance; the repeat starts in place,
      // since it sits far below the fold when the page loads.
      data-reveal={reveal ? "" : undefined}
      data-revealed={reveal ? undefined : ""}
    >
      {/*
        A tile with a case study behind it leads there; one without opens its
        artwork full size. A tile with neither — a placeholder, or the
        duplicate pass — is just something to look at.
      */}
      {tile.href ? (
        <Link href={tile.href} className={styles.link}>
          {inside}
        </Link>
      ) : interactive && tile.media ? (
        <ArtworkTrigger tile={tile} className={styles.link}>
          {inside}
        </ArtworkTrigger>
      ) : (
        inside
      )}
    </div>
  );
}

/**
 * One full pass of the mosaic. Two are stacked so the page can loop endlessly;
 * MosaicScroll hides the seam between them.
 */
function Canvas({
  copy,
  skipColumn,
  identity,
}: {
  copy: number;
  skipColumn?: number;
  identity: boolean;
}) {
  const isOriginal = copy === 0;
  const shown = tiles.filter(
    (tile) => skipColumn === undefined || columnOf(tile) !== skipColumn,
  );

  const style = {
    // Passed as a custom property rather than a height so the responsive rules
    // in the stylesheet can still drop the canvas out of absolute layout.
    "--canvas-height": CANVAS_HEIGHT,
    // The caption's own measurements, in pixels, handed down so the band a tile
    // leaves for it is the same figure as what stands in it.
    "--band": `${TITLE_BAND}px`,
    "--caption-top": `${CAPTION.top}px`,
    "--caption-line": CAPTION.line,
    "--caption-name": `${CAPTION.name}px`,
    "--caption-note": `${CAPTION.note}px`,
  } as CSSProperties;

  return (
    <div
      className={styles.canvas}
      style={style}
      data-mosaic=""
      data-copy={copy}
      // The repeat exists to make the loop seamless, not to be read out twice.
      aria-hidden={isOriginal ? undefined : true}
    >
      {identity ? (
        <>
          <Identity intro={isOriginal} />
          <Identity roaming />
        </>
      ) : null}
      {shown.map((tile, index) => (
        <MosaicTile
          key={tile.id}
          tile={tile}
          priority={isOriginal && index < ABOVE_THE_FOLD}
          reveal={isOriginal}
          interactive={isOriginal}
        />
      ))}
    </div>
  );
}

export function Mosaic({
  /** Leave this column clear, for a layout that puts something else there. */
  skipColumn,
  /** End the grid above the strip a page keeps at the foot of the screen. */
  clearFoot = false,
  /** Whether the mosaic carries the studio's name, fixed and roaming. */
  identity = true,
  /** Hold the tiles back, for a page that opens with something else first. */
  delay = 0,
}: {
  skipColumn?: number;
  clearFoot?: boolean;
  identity?: boolean;
  delay?: number;
} = {}) {
  return (
    <ArtworkProvider>
      <div
        className={clearFoot ? `${styles.loop} ${styles.clearFoot}` : styles.loop}
      >
        <MosaicMotion delay={delay} />
        <MosaicScroll />
        {identity ? <IdentityRelay /> : null}
        <Canvas copy={0} skipColumn={skipColumn} identity={identity} />
        <Canvas copy={1} skipColumn={skipColumn} identity={identity} />
      </div>
    </ArtworkProvider>
  );
}
