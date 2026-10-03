import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/data/site";

/**
 * The icon iOS keeps when the site is saved to a home screen.
 *
 * It cannot be the same file as the tab's. iOS wants a PNG, ignores
 * transparency — it composites whatever it is given onto an opaque tile — and
 * takes no notice of the colour scheme, so the mark has to settle on one
 * background and stand against it. It stands on the canvas the site itself is
 * drawn on, which makes the home screen read as the page it opens.
 *
 * Generated from src/app/icon.svg rather than from a fourth copy of the mark,
 * so the tab and the home screen cannot drift apart.
 */
export const alt = `${site.name}`;

/** What iOS asks for, and what it downsamples from for every smaller slot. */
export const size = { width: 180, height: 180 };

export const contentType = "image/png";

/** Named in full: the bundler reads the path, and one it cannot read makes it
 *  trace the whole project into the server bundle. See opengraph-image.tsx. */
const MARK = join(process.cwd(), "src/app/icon.svg");

/** The canvas, straight from globals.css. */
const CANVAS = "#000000";

export default async function AppleIcon() {
  const source = await readFile(MARK, "utf8");

  /*
   * The tab's mark answers to the colour scheme through a media query, which
   * is no use on a tile that is always black. The rule is replaced with a
   * flat white one rather than the file being duplicated.
   */
  const white = source.replace(
    /<style>[\s\S]*?<\/style>/,
    "<style>path { fill: #fff; }</style>",
  );

  const mark = `data:image/svg+xml;base64,${Buffer.from(white).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: CANVAS,
        }}
      >
        {/* Inset, so the mark is not pressed against the tile's rounded corners. */}
        <img src={mark} alt="" width={116} height={116} />
      </div>
    ),
    size,
  );
}
