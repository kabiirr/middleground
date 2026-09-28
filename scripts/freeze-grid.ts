/**
 * Freezes the mosaic's arithmetic to a fixture, so that any later change to
 * how the wall is built can be diffed against the wall as it stands today.
 *
 * This is the regression oracle for the content handover. The grid is a solved
 * arrangement — five columns that have to finish level to the pixel — and the
 * work ahead moves where that arrangement comes from. Nothing about it may
 * change on the way. What is written here is what "unchanged" means.
 *
 *   npm run grid:freeze   — write the fixture
 *   npm run grid:check    — fail if the grid has moved since
 */
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  COLUMN_METRICS,
  IDENTITY_HEIGHT,
  TITLE_BAND,
  canvasHeight,
  identityPlace,
  identityRect,
  identitySlots,
  projectIndex,
  tiles,
} from "../src/data/projects";

const FIXTURE = join(
  process.cwd(),
  "src/data/__fixtures__/grid.json",
);

/**
 * Everything the page's geometry is made of, and everything derived from it
 * that leaves the site — the structured data's project list included, since a
 * project quietly dropping out of the mosaic also drops it out of the markup.
 */
function snapshot() {
  return {
    tiles,
    columnMetrics: COLUMN_METRICS,
    identity: {
      height: IDENTITY_HEIGHT,
      rect: identityRect,
      place: identityPlace,
      slots: identitySlots,
    },
    canvasHeight,
    titleBand: TITLE_BAND,
    projectIndex,
  };
}

const json = `${JSON.stringify(snapshot(), null, 2)}\n`;

if (process.argv.includes("--check")) {
  const held = readFileSync(FIXTURE, "utf8");

  if (held !== json) {
    console.error(
      "The mosaic's geometry has moved since the fixture was frozen.\n\n" +
        "If that was the point — the grid was meant to change — run\n" +
        "`npm run grid:freeze` and commit the new fixture alongside the\n" +
        "change, so the diff shows what moved. If it was not, something\n" +
        "has shifted the wall by accident.\n",
    );
    process.exit(1);
  }

  console.log("The mosaic stands where the fixture says it does.");
} else {
  writeFileSync(FIXTURE, json);
  console.log(
    `Froze ${tiles.length} tiles across ${COLUMN_METRICS.length} columns, ` +
      `identity block ${IDENTITY_HEIGHT.toFixed(2)}px → ${FIXTURE}`,
  );
}
