import {
  COLUMN_WIDTH,
  COLUMN_X,
  GUTTER,
  IDENTITY_CONTENT_HEIGHT,
  IDENTITY_RECT,
  type Rect,
} from "./design";

/**
 * A tile holds either a still or a silent looping clip. Both are cropped to the
 * tile with object-fit, so any aspect ratio works — though artwork close to the
 * tile's own proportions loses least at the edges.
 */
export type TileMedia =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster?: string };

export type Tile = {
  /** Unique key for the tile. */
  id: string;
  /** Figma node id, present on the tiles lifted straight from the design. */
  node?: string;
  /** Position on the canvas, in design pixels. */
  rect: Rect;
  /** Artwork. Leave undefined and the tile stays the grey placeholder. */
  media?: TileMedia;
  /** Describe the work, not the file — this is what screen readers announce. */
  alt?: string;
  /** Project name, shown on hover. */
  title?: string;
  /** Optional link to a case study. */
  href?: string;
};

/**
 * Artwork helpers. Each returns the media plus the descriptions that travel
 * with it, so a tile only has to name the piece it carries.
 */
function work(
  src: string,
  alt: string,
  title: string,
): Pick<Tile, "media" | "alt" | "title"> {
  return { media: { kind: "image", src: `/images/${src}` }, alt, title };
}

function clip(n: number): Pick<Tile, "media" | "alt" | "title"> {
  return {
    media: { kind: "video", src: `/images/motion-${String(n).padStart(2, "0")}.mp4` },
    alt: "Motion study",
    title: "MOTION",
  };
}

/** Artemis — brand identity for a fossil identification app. */
const artemis = (n: number) =>
  work(
    `artemis-${String(n).padStart(2, "0")}.jpg`,
    "Artemis — brand identity for a fossil identification app",
    "ARTEMIS",
  );

/** Outsmarted My Molars — sticker campaign. */
const molars = (n: number) =>
  work(
    `molars-${String(n).padStart(2, "0")}.jpg`,
    "Outsmarted My Molars — sticker campaign",
    "OUTSMARTED MY MOLARS",
  );

/** Glass Banking — identity for a fintech product. */
const GLASS_ALT = [
  "Glass Banking — the logotype over a pattern of translucent cards",
  "Glass Banking — case study opener, set on black with layered glass forms",
  "Glass Banking — the black payment card, its name showing through the face",
  "Glass Banking — a pull quote from the client on building a transparent brand",
];
const glass = (n: number) =>
  work(`glass-0${n}.jpg`, GLASS_ALT[n - 1], "GLASS BANKING");

/** DABA — identity for a body care range. */
const DABA_ALT = [
  "DABA — the logotype set across a close-up portrait",
  "DABA — body wash bottles photographed against the brand's terracotta palette",
];
const daba = (n: number) => work(`daba-0${n}.jpg`, DABA_ALT[n - 1], "DABA");

/** woka — identity for a finance platform for digital workers. */
const WOKA_ALT = [
  "woka — the logotype beneath its mark, a sunburst drawn as an open hand",
  "woka — the mark set out on its construction grid",
  "woka — the mark opened out into rays across the brand's deep red",
  "woka — campaign image: finance infrastructure for digital workers",
];
const woka = (n: number) =>
  work(`woka-0${n}.jpg`, WOKA_ALT[n - 1], "WOKA");

/** Tech for the World Forum — identity for a technology conference. */
const TWF_ALT = [
  "Tech for the World Forum — the stacked logotype beneath its globe mark",
  "Tech for the World Forum — the logotype with the globe set into the word",
];
const twf = (n: number) =>
  work(`twf-0${n}.jpg`, TWF_ALT[n - 1], "TECH FOR THE WORLD FORUM");

/** Nomadi — identity for a travel brand. */
const nomadi = () =>
  work(
    "nomadi-01.jpg",
    "Nomadi — the wordmark over a portrait at the shoreline",
    "NOMADI",
  );

/** MO.FOOD — packaging for a dried seafood range. */
const mofood = () =>
  work(
    "mofood-01.avif",
    "MO.FOOD — packaging for the dried, ground and smoked shrimp range",
    "MO.FOOD",
  );

/**
 * The mosaic, as five column stacks.
 *
 * Every gap is GUTTER — between columns, between tiles, and at the join where
 * the page loops. That last one is why all five columns are the same total
 * height: a column finishing short would open a wider gap at the seam than
 * anywhere else in the grid.
 *
 * Column three carries the studio's name, so it holds a shorter tile above the
 * block and picks up the difference in its last tile.
 */
/** What every column adds up to, the identity block included. */
const COLUMN_TOTAL = 2228;

/**
 * Tile heights per column, drawn from the set the design uses — with the last
 * tile of each left out. That one is computed so the column reaches
 * COLUMN_TOTAL, which is what keeps all five ending on the same line and the
 * loop seam as even as every other gap. Change anything here and the balance
 * still holds.
 */
const COLUMN_PLAN: number[][] = [
  [295, 319, 319, 286, 353, 303],
  [319, 353, 353, 269, 319, 329],
  // Column three: the tile above the identity block, then those below it.
  [IDENTITY_RECT.y - GUTTER * 2, 353, 331, 319, 331],
  [331, 286, 286, 353, 295, 324],
  [353, 269, 269, 319, 353, 353],
];

const COLUMNS: number[][] = COLUMN_PLAN.map((heights, column) => {
  // The identity block sits in column three and counts toward its total.
  const carried = column === 2 ? IDENTITY_RECT.height : 0;
  const balance =
    COLUMN_TOTAL - carried - heights.reduce((sum, h) => sum + h, 0);
  return [...heights, balance];
});

/** Stacks one column, leaving room for the identity block where it sits. */
function stack(column: number, heights: number[]): Tile[] {
  const x = COLUMN_X[column];
  let y = GUTTER;

  return heights.map((height, row) => {
    const tile: Tile = {
      id: `c${column + 1}-r${row + 1}`,
      rect: { x, y, width: COLUMN_WIDTH, height },
    };

    y += height + GUTTER;

    // The studio's name occupies the slot after the first tile of column three.
    if (column === 2 && row === 0) {
      y = IDENTITY_RECT.y + IDENTITY_RECT.height + GUTTER;
    }

    return tile;
  });
}

const COLUMN_TILES = COLUMNS.map((heights, column) => stack(column, heights));

/**
 * Artwork, applied to the tiles in reading order — left to right along each
 * row, then down. Projects are interleaved rather than grouped, so the grid
 * mixes as you scroll. Add entries as work comes in; tiles beyond the end of
 * this list render as the grey placeholder from the design.
 *
 * `artemis-12.jpg` is held back — there are 35 pieces for 34 tiles, and Artemis
 * is the largest set. Swap it in for any entry here.
 */
const ARTWORK = [
  woka(1), artemis(1), twf(1), clip(1), molars(1),
  glass(1), clip(2), daba(1), artemis(2),
  nomadi(), artemis(3), mofood(), clip(3), woka(2),
  glass(2), molars(2), artemis(4), clip(4), twf(2),
  artemis(5), woka(3), molars(3), clip(5), glass(3),
  daba(2), artemis(6), woka(4), artemis(7), glass(4),
  artemis(8), molars(4), artemis(9), artemis(10), artemis(11),
];

/** Every tile, ordered by row then column, with artwork applied in that order. */
export const tiles: Tile[] = COLUMN_TILES.flat()
  .sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x)
  .map((tile, index) => ({ ...tile, ...(ARTWORK[index] ?? {}) }));

/**
 * Where the studio's name can stand in the grid besides its place on the first
 * screen.
 *
 * A slot is simply a tile: the name takes that tile's exact footprint, so the
 * gutters around it are the grid's own and it sits in the composition like
 * anything else. The logotype goes to the top and the tagline to the foot, with
 * the space between falling out of the tile's height — which is why a host only
 * has to be tall enough to hold both with a decent gap left over.
 */
const MIN_IDENTITY_GAP = 120;
const MIN_HOST_HEIGHT = IDENTITY_CONTENT_HEIGHT + MIN_IDENTITY_GAP;

export type IdentitySlot = {
  /** The tile this slot replaces. */
  tile: string;
  /** Its footprint, which the name takes over whole. */
  rect: Rect;
};

/** Whether a tile is the one directly above or below the block on screen one. */
function bordersTheFixedBlock({ rect }: Tile) {
  if (rect.x !== IDENTITY_RECT.x) return false;
  const above = IDENTITY_RECT.y - (rect.y + rect.height);
  const below = rect.y - (IDENTITY_RECT.y + IDENTITY_RECT.height);
  return Math.abs(above) <= GUTTER || Math.abs(below) <= GUTTER;
}

export const identitySlots: IdentitySlot[] = tiles
  .filter(
    (tile) =>
      tile.rect.height >= MIN_HOST_HEIGHT && !bordersTheFixedBlock(tile),
  )
  .map((tile) => ({ tile: tile.id, rect: tile.rect }));

/**
 * Height of the canvas: the lowest tile edge, with no margin beneath it.
 *
 * The page loops, so there is no bottom of the page to leave room under — the
 * next pass brings its own top margin, and that alone is the gap at the seam.
 * A margin here as well would make the join twice as wide as every other gap.
 */
export const canvasHeight = Math.max(
  ...tiles.map((tile) => tile.rect.y + tile.rect.height),
);
