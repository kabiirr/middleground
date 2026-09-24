/**
 * The pill a section hands the pointer in place of the cursor.
 *
 * It arrives rather than simply appears: it opens from a circle into its full
 * length, and its label runs on a loop inside it. It shows while the band it
 * sits in is lit — which is the Torch's doing, not its own — and takes whatever
 * fill that band has drawn.
 *
 * Three copies of the same words, and only for want of a way to do it with one:
 * the first stands still and unseen, and is what gives the pill its width; the
 * other two run, the second following the first so the line never shows its
 * end. All of it is decoration — the link it belongs to carries the meaning.
 */
import styles from "./CursorPill.module.css";

export function CursorPill({ label }: { label: string }) {
  return (
    <span className={styles.pill} aria-hidden="true">
      <span className={styles.width}>{label}</span>
      <span className={styles.loop}>
        <span>{label}</span>
        <span>{label}</span>
      </span>
    </span>
  );
}
