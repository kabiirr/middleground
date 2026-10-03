import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/data/site";

/**
 * The card every link to this site unfurls into — in a message, a post, a
 * search result's preview, an assistant's citation.
 *
 * It is the studio's own artwork rather than anything composed here. What this
 * file does is fit it to the frame: the supplied card is 5760 × 3400, and
 * every platform that reads an og:image wants 1200 × 630. Handing over the
 * original would leave each of them to crop it however they saw fit, at eleven
 * times the pixels anyone will look at.
 */
export const alt = `${site.name} — brand design studio`;

/** 1200 × 630, the 1.91:1 every platform crops to without cropping. */
export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/*
 * Named in full rather than built by a helper: the bundler reads this path
 * statically to work out what to ship, and one it cannot read makes it give up
 * and trace the entire project into the server bundle, public/ and all.
 */
const CARD = join(process.cwd(), "public/images/og image.png");

/** The canvas, straight from globals.css — and the card's own background. */
const CANVAS = "#000000";

/**
 * The supplied card is 1.694:1 against the frame's 1.905:1, so something has to
 * give. It is cropped rather than lettered-boxed: the wordmark sits in the
 * middle fifth of a very tall black field, so taking 11% off the height costs
 * nothing and leaves the type as large as the frame allows. The bars either way
 * would have been black on black and invisible — but smaller.
 */
const SCALED = { width: 1200, height: 708 };

export default async function Image() {
  const card = await readFile(CARD);
  const src = `data:image/png;base64,${card.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: CANVAS,
        }}
      >
        <img src={src} alt="" width={SCALED.width} height={SCALED.height} />
      </div>
    ),
    size,
  );
}
