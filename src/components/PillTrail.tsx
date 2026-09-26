"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/motion";

import styles from "./PillTrail.module.css";

/** How far the pointer travels between one pill being dropped and the next. */
const STEP = 120;

/** How many may be on the floor at once; the oldest goes to make room. */
const KEPT = 12;

/** Pixels per second per second. Heavier than the real thing, which reads as
 * slow on a screen this size. */
const GRAVITY = 3200;

/** How much of its speed a pill keeps off the floor, and off the sides. */
const BOUNCE = 0.42;
const WALL = 0.5;

/** And how much it loses to the floor each time it touches it. */
const FRICTION = 0.78;

/** How long one takes to arrive, in milliseconds. */
const APPEAR = 260;

/** Air kept between two pills, so a stack reads as things rather than a wall. */
const CUSHION = 3;

/** How much of its speed a pill keeps off another pill, which is less than off
 * the floor: one gives where the other does not. */
const KNOCK = 0.26;

/** Below this, a bounce is not worth having: it lies down instead. */
const SETTLE = 70;

/** How long one lasts, and how long it takes to go at the end of that. */
const LIFE = 5200;
const FADE = 900;

type Body = {
  node: HTMLElement;
  /** Its own size, measured once: it never changes and the loop runs often. */
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  born: number;
  resting: boolean;
};

/**
 * The pills the cursor lets fall behind it, which then drop to the foot of the
 * section and settle there.
 *
 * They are dropped by distance rather than by time, so the trail is a record of
 * where the pointer went rather than of how long it lingered, and each leaves
 * with the pointer's own speed — thrown by the cursor rather than released from
 * it. After that they are only falling: gravity, a bounce that keeps less of
 * the speed each time, and a spin that the floor takes out of them.
 *
 * Kept out of React's hands once they exist. A dozen bodies moving every frame
 * is not a thing to re-render; the list is built here and each body's transform
 * is written straight onto its own element.
 *
 * Desktop only, and only where motion is welcome: there is no cursor to leave a
 * trail behind on a touch screen.
 */
export function PillTrail({
  labels,
  tones,
}: {
  labels: readonly string[];
  tones: readonly string[];
}) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layer.current;
    const band = element?.parentElement;
    if (!element || !band) return;

    if (!window.matchMedia("(min-width: 1200px) and (hover: hover)").matches) {
      return;
    }
    if (prefersReducedMotion()) return;

    const bodies: Body[] = [];
    let at: { x: number; y: number } | null = null;
    let travelled = 0;
    let next = 0;

    /** Writes a body where it is, at whatever it has grown to. */
    const place = (body: Body, grown: number) => {
      body.node.style.transform =
        `translate(${body.x}px, ${body.y}px) rotate(${body.angle}deg)` +
        ` scale(${0.86 + grown * 0.14})`;
    };

    const drop = (x: number, y: number, vx: number, vy: number) => {
      const node = document.createElement("span");
      node.className = styles.pill;
      // Through the list in order, so the trail names the work rather than
      // repeating whichever name chance keeps landing on.
      node.textContent = labels[next % labels.length];
      node.style.backgroundColor = tones[next % tones.length];
      next += 1;
      element.append(node);

      const w = node.offsetWidth;
      const h = node.offsetHeight;
      const body: Body = {
        node,
        w,
        h,
        x: x - w / 2,
        y: y - h / 2,
        vx,
        vy,
        angle: (Math.random() - 0.5) * 16,
        spin: (Math.random() - 0.5) * 180,
        born: performance.now(),
        resting: false,
      };
      // Put where it fell at once, and out of sight. Left to the next frame it
      // would spend that frame in the corner of the section, which is a
      // flicker in the corner of the eye every time one is dropped.
      body.node.style.opacity = "0";
      place(body, 0);
      bodies.push(body);

      while (bodies.length > KEPT) bodies.shift()?.node.remove();
    };

    /**
     * Keeps two pills out of one another's place.
     *
     * Each is taken as its own upright box — near enough, since a pill is all
     * but flat by the time it comes to rest — and any overlap is undone along
     * whichever axis it is shallower on, which is what makes them land on each
     * other rather than pass through. One that has settled does not give: the
     * one still moving takes the whole of the push, and so the pile builds.
     */
    const separate = () => {
      for (let pass = 0; pass < 2; pass += 1) {
        for (let i = 0; i < bodies.length; i += 1) {
          for (let j = i + 1; j < bodies.length; j += 1) {
            const a = bodies[i];
            const b = bodies[j];
            if (a.resting && b.resting) continue;

            const dx = a.x + a.w / 2 - (b.x + b.w / 2);
            const dy = a.y + a.h / 2 - (b.y + b.h / 2);
            const overlapX = (a.w + b.w) / 2 + CUSHION - Math.abs(dx);
            const overlapY = (a.h + b.h) / 2 + CUSHION - Math.abs(dy);
            if (overlapX <= 0 || overlapY <= 0) continue;

            const share = a.resting || b.resting ? 1 : 0.5;
            const aGives = a.resting ? 0 : share;
            const bGives = b.resting ? 0 : share;

            if (overlapY < overlapX) {
              const push = dy < 0 ? -overlapY : overlapY;
              a.y += push * aGives;
              b.y -= push * bGives;
              // Whichever went up has landed on the other.
              const upper = dy < 0 ? a : b;
              if (!upper.resting) {
                upper.vy = -upper.vy * KNOCK;
                upper.vx *= FRICTION;
                upper.spin *= 0.4;
                if (Math.abs(upper.vy) < SETTLE) {
                  upper.vx = 0;
                  upper.vy = 0;
                  upper.spin = 0;
                  upper.resting = true;
                  upper.angle = Math.max(-12, Math.min(12, upper.angle));
                }
              }
            } else {
              const push = dx < 0 ? -overlapX : overlapX;
              a.x += push * aGives;
              b.x -= push * bGives;
              if (!a.resting) a.vx = -a.vx * KNOCK;
              if (!b.resting) b.vx = -b.vx * KNOCK;
            }
          }
        }
      }
    };

    const step = (_time: number, delta: number) => {
      // A tab coming back from the background hands over one enormous frame,
      // which would put everything through the floor at once.
      const seconds = Math.min(delta, 34) / 1000;
      const now = performance.now();
      const width = band.clientWidth;
      const height = band.clientHeight;

      for (let i = bodies.length - 1; i >= 0; i -= 1) {
        const body = bodies[i];
        if (now - body.born > LIFE) {
          body.node.remove();
          bodies.splice(i, 1);
          continue;
        }
        if (body.resting) continue;

        body.vy += GRAVITY * seconds;
        body.x += body.vx * seconds;
        body.y += body.vy * seconds;
        body.angle += body.spin * seconds;

        const right = width - body.w;
        if (body.x < 0) {
          body.x = 0;
          body.vx = -body.vx * WALL;
        } else if (body.x > right) {
          body.x = right;
          body.vx = -body.vx * WALL;
        }

        const floor = height - body.h;
        if (body.y >= floor) {
          body.y = floor;
          body.vy = -body.vy * BOUNCE;
          body.vx *= FRICTION;
          body.spin *= 0.45;

          if (Math.abs(body.vy) < SETTLE) {
            body.vy = 0;
            body.vx = 0;
            body.spin = 0;
            body.resting = true;
            // Lying down: whatever lean it came to rest at, and no more.
            body.angle = Math.max(-12, Math.min(12, body.angle));
          }
        }
      }

      separate();

      for (const body of bodies) {
        const age = now - body.born;
        /*
         * Coming in: it grows the last of the way into its size and up out of
         * nothing over a quarter of a second, eased so that it is quick to
         * appear and slow to finish, which is what keeps it from arriving as a
         * shape switched on.
         */
        const arriving = Math.min(age / APPEAR, 1);
        const grown = 1 - (1 - arriving) ** 3;
        const going = Math.max(0, Math.min(1, (LIFE - age) / FADE));
        body.node.style.opacity = `${Math.min(grown, going)}`;
        place(body, grown);
      }
    };

    const onMove = (event: PointerEvent) => {
      const box = band.getBoundingClientRect();
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;

      const here = { x: event.clientX - box.left, y: event.clientY - box.top };
      const was = at;
      at = inside ? here : null;
      if (!inside || !was) return;

      const dx = here.x - was.x;
      const dy = here.y - was.y;
      travelled += Math.hypot(dx, dy);
      if (travelled < STEP) return;
      travelled = 0;

      // It leaves with the pointer's own speed, which is what makes it read as
      // dropped rather than placed.
      drop(here.x, here.y, dx * 9, dy * 4);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    gsap.ticker.add(step);

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(step);
      bodies.forEach((body) => body.node.remove());
    };
  }, [labels, tones]);

  return <div ref={layer} className={styles.layer} aria-hidden="true" />;
}
