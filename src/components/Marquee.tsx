"use client";

import { useCallback, useState, type CSSProperties, type PointerEvent } from "react";

import type { Service } from "@/data/site";
import { prefersReducedMotion } from "@/lib/motion";

import styles from "./Marquee.module.css";

/**
 * A continuously scrolling strip of services.
 *
 * Hovering a phrase holds the strip still, fades its sister phrases back, and
 * pops that service's disciplines out around it. The pills then trail the
 * cursor, each at its own rate, so the cluster has some depth to it.
 *
 * The track holds two identical groups so the loop is seamless; only the first
 * is exposed to assistive technology.
 */
export function Marquee({
  services,
  label,
  className,
  reveal = false,
}: {
  services: Service[];
  label: string;
  className?: string;
  /**
   * Play the page's entrance on this element.
   *
   * It has to sit here rather than on a wrapper: the entrance animates a
   * transform, and a transformed element becomes the containing block for any
   * absolutely positioned descendant. A wrapper would therefore capture this
   * strip and re-anchor it to itself, which threw it off screen entirely.
   */
  reveal?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);

  const follow = useCallback((event: PointerEvent<HTMLLIElement>) => {
    if (prefersReducedMotion()) return;

    const item = event.currentTarget;
    const bounds = item.getBoundingClientRect();

    // -1 to 1 across the phrase, so each pill can scale its own response.
    item.style.setProperty(
      "--pointer-x",
      (((event.clientX - bounds.left) / bounds.width) * 2 - 1).toFixed(3),
    );
    item.style.setProperty(
      "--pointer-y",
      (((event.clientY - bounds.top) / bounds.height) * 2 - 1).toFixed(3),
    );
  }, []);

  const release = useCallback((event: PointerEvent<HTMLLIElement>) => {
    setActive(null);
    // Let the pills settle back to centre rather than holding their last offset.
    event.currentTarget.style.removeProperty("--pointer-x");
    event.currentTarget.style.removeProperty("--pointer-y");
  }, []);

  return (
    <div
      className={`${styles.marquee}${className ? ` ${className}` : ""}`}
      aria-label={label}
      data-reveal={reveal ? "" : undefined}
      data-paused={active ? "" : undefined}
    >
      <div className={styles.track}>
        {[0, 1].map((group) => (
          <ul
            key={group}
            className={styles.group}
            aria-hidden={group === 1 ? true : undefined}
          >
            {services.map((service) => (
              <li
                key={service.name}
                className={styles.item}
                data-active={active === service.name ? "" : undefined}
                data-dimmed={
                  active && active !== service.name ? "" : undefined
                }
                onPointerEnter={() => setActive(service.name)}
                onPointerLeave={release}
                onPointerMove={follow}
              >
                <span className={styles.phrase}>{service.name}</span>

                <ul className={styles.pills}>
                  {service.pills.map((pill, index) => (
                    <li
                      key={`${pill.label}-${index}`}
                      className={styles.pill}
                      style={
                        {
                          "--pill-x": pill.x,
                          "--pill-y": pill.y,
                          // Staggered so the cluster arrives in sequence, and
                          // each pill trails the cursor by a different amount.
                          "--pill-delay": `${index * 40}ms`,
                          "--pill-depth": 8 + index * 4,
                          background: pill.colour,
                        } as CSSProperties
                      }
                    >
                      {pill.label}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
