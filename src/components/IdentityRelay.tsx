"use client";

import { useEffect } from "react";

import { COLUMN_BEFORE } from "@/data/design";
import { TITLE_BAND, identitySlots } from "@/data/projects";
import { gsap } from "@/lib/motion";

/** How far beyond the viewport a slot must sit before it can be moved to. */
const CLEARANCE = 40;

/** How far ahead to look for the next slot, as a share of the viewport. */
const REACH = 1.5;

/**
 * How much further than the nearest candidate a slot may be and still be in the
 * running, in pixels.
 *
 * Choosing from everything within reach would sometimes send the name most of a
 * screen away, leaving a long stretch with nothing to see; always taking the
 * nearest would make it predictable. The columns step down out of phase with
 * one another, so at any point there are usually four tiles at much the same
 * distance ahead — a narrow window is enough to pick a different column and
 * height each time while staying as close as taking the nearest.
 */
const TOLERANCE = 60;

/**
 * Keeps the studio's name within reach wherever you are on the page.
 *
 * The name has a fixed place on the first screen, but the mosaic runs on well
 * past it. A second copy roams: whenever it leaves the viewport it is moved to
 * another slot in the grid — off screen, ahead of the direction of travel, and
 * chosen at random from those near enough to be reached shortly. Scroll on and
 * it turns up again somewhere new, standing where a tile would otherwise be.
 *
 * Every move happens out of sight, so the swap itself is never witnessed; what
 * you see is simply the name appearing somewhere in the grid.
 */
export function IdentityRelay() {
  useEffect(() => {
    const roamers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-roaming]"),
    );
    if (roamers.length === 0 || identitySlots.length === 0) return;

    /** Both passes of the mosaic hold the same slot, so they move together. */
    const place = (slot: (typeof identitySlots)[number]) => {
      roamers.forEach((roamer) => {
        // Counted as the grid counts it: gutters, which hold, and artwork,
        // which grows with the screen.
        roamer.style.setProperty("--slot-xg", `${slot.place.column + 1}`);
        roamer.style.setProperty("--slot-xd", `${COLUMN_BEFORE[slot.place.column]}`);
        roamer.style.setProperty("--slot-yg", `${slot.place.gaps}`);
        roamer.style.setProperty("--slot-yb", `${slot.place.bands}`);
        roamer.style.setProperty("--slot-yd", `${slot.place.stacked}`);
        roamer.style.setProperty("--slot-w", `${slot.rect.width}`);
        roamer.style.setProperty(
          "--slot-art",
          `${slot.rect.height - TITLE_BAND}`,
        );
        roamer.dataset.placed = "";
      });

      // The tile it stands in for steps aside, in both passes.
      document
        .querySelectorAll<HTMLElement>("[data-covered]")
        .forEach((tile) => delete tile.dataset.covered);
      document
        .querySelectorAll<HTMLElement>(`[data-tile="${slot.tile}"]`)
        .forEach((tile) => {
          tile.dataset.covered = "";
        });

      current = slot;
    };

    /** Nearest viewport position of a slot, across both passes of the mosaic. */
    const positionsOf = (slot: (typeof identitySlots)[number]) =>
      Array.from(
        document.querySelectorAll<HTMLElement>(`[data-tile="${slot.tile}"]`),
      ).map((tile) => tile.getBoundingClientRect());

    let current: (typeof identitySlots)[number] | null = null;
    /**
     * Whether the current slot has actually been on screen yet.
     *
     * A slot is always chosen off screen, so without this the next frame would
     * find it still off screen and move it again — the name would hop between
     * slots every frame and never be anywhere long enough to be seen.
     */
    let seen = false;
    let lastScroll = window.scrollY;
    let direction = 1;

    const relocate = () => {
      const height = window.innerHeight;

      const reachable = identitySlots
        .filter((slot) => slot !== current)
        .map((slot) => {
          // How far past the edge of the screen each instance sits, in the
          // direction of travel. Smallest wins: that is the one you meet next.
          const distances = positionsOf(slot).map((rect) =>
            direction > 0 ? rect.top - height : -rect.bottom,
          );
          return { slot, distance: Math.min(...distances) };
        })
        .filter(
          ({ distance }) =>
            distance > CLEARANCE && distance < height * REACH,
        );

      // Nothing ahead within reach — leave it where it is rather than drop it
      // somewhere the visitor is about to scroll away from.
      if (reachable.length === 0) return;

      reachable.sort((a, b) => a.distance - b.distance);

      const near = reachable.filter(
        ({ distance }) => distance <= reachable[0].distance + TOLERANCE,
      );

      place(near[Math.floor(Math.random() * near.length)].slot);
      seen = false;
    };

    const update = () => {
      const scroll = window.scrollY;
      if (scroll !== lastScroll) {
        direction = scroll > lastScroll ? 1 : -1;
        lastScroll = scroll;
      }

      if (!current) {
        relocate();
        return;
      }

      const height = window.innerHeight;
      const positions = positionsOf(current);

      if (positions.some((rect) => rect.bottom > 0 && rect.top < height)) {
        seen = true;
        return;
      }

      // Off screen: move on once it has had its turn, or if the visitor has
      // turned around and is now heading away from it.
      const ahead = positions.some((rect) =>
        direction > 0 ? rect.top >= height : rect.bottom <= 0,
      );

      if (seen || !ahead) relocate();
    };

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      roamers.forEach((roamer) => delete roamer.dataset.placed);
      document
        .querySelectorAll<HTMLElement>("[data-covered]")
        .forEach((tile) => delete tile.dataset.covered);
    };
  }, []);

  return null;
}
