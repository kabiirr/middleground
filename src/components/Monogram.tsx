import styles from "./Monogram.module.css";

/**
 * The studio's circular mark, turning slowly on the spot.
 *
 * The rotation is on the artwork itself rather than this wrapper: the wrapper
 * plays the page's entrance, and GSAP clears the individual transform
 * properties when it takes over an element's transform — a rotation set here
 * would be wiped the moment that animation began.
 */
export function Monogram({
  className,
  /** Leave the entrance to the page, which is sequencing it itself. */
  intro = false,
}: {
  className?: string;
  intro?: boolean;
}) {
  return (
    <div
      className={`${styles.monogram}${className ? ` ${className}` : ""}`}
      data-mark=""
      data-reveal={intro ? undefined : ""}
      data-intro={intro ? "mark" : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.mark}
        src="/monogram.svg"
        alt=""
        width={80}
        height={80}
      />
    </div>
  );
}
