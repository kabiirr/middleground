import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { CANVAS_WIDTH, COLUMN_X, toStyle } from "@/data/design";
import { canvasHeight, tiles, type Tile } from "@/data/projects";

import { Identity } from "./Identity";
import { MosaicMotion } from "./MosaicMotion";
import { IdentityRelay } from "./IdentityRelay";
import { MosaicScroll } from "./MosaicScroll";
import { TileVideo } from "./TileVideo";
import styles from "./Mosaic.module.css";

/**
 * Sizes hint for the responsive image loader: one fifth of the viewport on the
 * desktop mosaic, widening as it drops to three, two, then one column.
 */
const IMAGE_SIZES =
  "(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1199px) 33vw, 20vw";

/** Tiles on the first screen are worth fetching eagerly; the rest are not. */
const ABOVE_THE_FOLD = 5;

/** Which of the five design columns a tile sits in, for the parallax drift. */
function columnOf(tile: Tile) {
  return COLUMN_X.reduce(
    (best, x, index) =>
      Math.abs(x - tile.rect.x) < Math.abs(COLUMN_X[best] - tile.rect.x)
        ? index
        : best,
    0,
  );
}

function TileContent({ tile, priority }: { tile: Tile; priority: boolean }) {
  const { media } = tile;

  if (!media) {
    // No artwork supplied yet — the tile stays the grey placeholder from Figma.
    return null;
  }

  return (
    <>
      {media.kind === "video" ? (
        <TileVideo
          className={styles.media}
          src={media.src}
          poster={media.poster}
        />
      ) : (
        <Image
          className={styles.media}
          src={media.src}
          alt={tile.alt ?? ""}
          fill
          sizes={IMAGE_SIZES}
          priority={priority}
        />
      )}
      {tile.title ? <p className={styles.caption}>{tile.title}</p> : null}
    </>
  );
}

function MosaicTile({
  tile,
  priority,
  reveal,
}: {
  tile: Tile;
  priority: boolean;
  reveal: boolean;
}) {
  const style = {
    ...toStyle(tile.rect),
    "--tile-ratio": `${tile.rect.width} / ${tile.rect.height}`,
  } as CSSProperties;

  const content = <TileContent tile={tile} priority={priority} />;

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
      {tile.href ? (
        <Link href={tile.href} className={styles.link}>
          {content}
        </Link>
      ) : (
        content
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
    // Passed as custom properties rather than width/height so the responsive
    // rules in the stylesheet can still drop the canvas out of absolute layout.
    "--canvas-width": CANVAS_WIDTH,
    "--canvas-height": canvasHeight,
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
        />
      ))}
    </div>
  );
}

export function Mosaic({
  /** Leave this column clear, for a layout that puts something else there. */
  skipColumn,
  /** Whether the mosaic carries the studio's name, fixed and roaming. */
  identity = true,
  /** Hold the tiles back, for a page that opens with something else first. */
  delay = 0,
}: {
  skipColumn?: number;
  identity?: boolean;
  delay?: number;
} = {}) {
  return (
    <div className={styles.loop}>
      <MosaicMotion delay={delay} />
      <MosaicScroll />
      {identity ? <IdentityRelay /> : null}
      <Canvas copy={0} skipColumn={skipColumn} identity={identity} />
      <Canvas copy={1} skipColumn={skipColumn} identity={identity} />
    </div>
  );
}
