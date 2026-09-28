import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/data/site";

/**
 * The card every link to this site unfurls into — in a message, a post, a
 * search result's preview, an assistant's citation.
 *
 * It is drawn rather than photographed because the studio's own type is the
 * point: a brand studio whose link previews are a screenshot and a fallback
 * sans is making an argument against itself. The wordmark is the site's own
 * SVG, and the line beneath it the same Miller Display italic the pages set.
 *
 * One image serves the whole site. A page that wants its own — a case study,
 * showing the work — puts an `opengraph-image` in its own folder, and the
 * nearer file wins.
 */
export const alt = `${site.name} — brand design studio`;

/** 1200 × 630, the 1.91:1 every platform crops to without cropping. */
export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/** Straight from globals.css: the canvas, the off-white, and the grey. */
const CANVAS = "#000000";
const BONE = "#efefe9";
const MUTED = "#787875";

/*
 * The four files this card is made of, each named in full.
 *
 * Spelled out rather than built by a helper on purpose: the bundler reads
 * these paths statically to work out what to ship, and a path it cannot read
 * makes it give up and trace the entire project into the server bundle —
 * every source file and every image in public/ along with it.
 */
const WORDMARK = join(process.cwd(), "public", "logo.svg");
const MONOGRAM = join(process.cwd(), "public", "monogram.svg");
const DISPLAY_FONT = join(
  process.cwd(),
  "src/assets/fonts/MillerDisplay-Italic.ttf",
);
const LABEL_FONT = join(
  process.cwd(),
  "src/assets/fonts/ArticulatCF-Medium.ttf",
);

/** An SVG read off disk as something satori will draw: a data URI. */
const inlineSvg = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export default async function Image() {
  const [wordmark, monogram, display, label] = await Promise.all([
    readFile(WORDMARK, "utf8").then(inlineSvg),
    readFile(MONOGRAM, "utf8").then(inlineSvg),
    readFile(DISPLAY_FONT),
    readFile(LABEL_FONT),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          padding: "64px 80px 68px",
        }}
      >
        <img src={monogram} alt="" width={84} height={84} />

        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          {/* The name, as the site draws it rather than as type set again. */}
          <img src={wordmark} alt="" width={340} height={181} />

          <div
            style={{
              display: "flex",
              fontFamily: "Miller Display",
              fontStyle: "italic",
              fontSize: 38,
              lineHeight: 1.3,
              color: BONE,
              maxWidth: 900,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Articulat CF",
            fontSize: 20,
            letterSpacing: 4,
            color: MUTED,
          }}
        >
          BRAND IDENTITY / STRATEGY / PACKAGING / WEBSITES
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Miller Display",
          data: display,
          style: "italic",
          weight: 400,
        },
        { name: "Articulat CF", data: label, style: "normal", weight: 500 },
      ],
    },
  );
}
