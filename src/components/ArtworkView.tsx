"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { scroller } from "@/lib/motion";
import type { Tile } from "@/data/projects";

import styles from "./ArtworkView.module.css";

/** What a tile hands over when it is opened. */
type Shown = Pick<Tile, "media" | "alt" | "title" | "note">;

const ArtworkContext = createContext<((tile: Shown) => void) | null>(null);

/** Opens a piece of artwork full size. Null outside the mosaic. */
export function useArtwork() {
  return useContext(ArtworkContext);
}

/**
 * Holds the artwork a visitor has opened, and shows it over the page.
 *
 * One of these wraps the whole mosaic rather than one per tile: there is only
 * ever a single piece open, and the overlay has to sit above the grid rather
 * than inside the tile it came from, which crops its own artwork.
 */
export function ArtworkProvider({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState<Shown | null>(null);
  /* Where the focus was before, so it can be handed back on the way out. */
  const opener = useRef<HTMLElement | null>(null);
  const close = useRef<HTMLButtonElement>(null);

  const open = useCallback((tile: Shown) => {
    opener.current = document.activeElement as HTMLElement | null;
    setShown(tile);
  }, []);

  const dismiss = useCallback(() => {
    setShown(null);
    opener.current?.focus();
    opener.current = null;
  }, []);

  useEffect(() => {
    if (!shown) return;

    // The page must not scroll underneath. Lenis drives the scrolling here, so
    // it is the one that has to be told; overflow alone would leave it running.
    const lenis = scroller.current;
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    close.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      lenis?.start();
    };
  }, [shown, dismiss]);

  return (
    <ArtworkContext.Provider value={open}>
      {children}
      {shown ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={shown.title ?? "Artwork"}
          /* Anywhere off the artwork closes it, as a lightbox should. */
          onClick={dismiss}
        >
          <button
            ref={close}
            type="button"
            className={styles.close}
            onClick={dismiss}
          >
            Close
          </button>

          {/* The artwork itself keeps its clicks, so a stray one does not shut it. */}
          <figure
            className={styles.figure}
            onClick={(event) => event.stopPropagation()}
          >
            {shown.media?.kind === "video" ? (
              <video
                className={styles.media}
                src={shown.media.src}
                poster={shown.media.poster}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : shown.media ? (
              /* Full size and one at a time: nothing for next/image to weigh up. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                className={styles.media}
                src={shown.media.src}
                alt={shown.alt ?? ""}
              />
            ) : null}

            {shown.title ? (
              <figcaption className={styles.caption}>
                <span className={styles.name}>{shown.title}</span>
                {shown.note ? (
                  <span className={styles.note}>{shown.note}</span>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </ArtworkContext.Provider>
  );
}

/**
 * The tile's own shell: everything inside it opens the artwork when clicked.
 *
 * A button rather than a link — there is no page to go to, and a link would
 * promise one. The duplicate pass of the mosaic renders its tiles plain, since
 * it exists only to make the loop seamless and is hidden from screen readers;
 * leaving buttons in it would put a second set of everything in the tab order.
 */
export function ArtworkTrigger({
  tile,
  className,
  children,
}: {
  tile: Shown;
  className?: string;
  children: ReactNode;
}) {
  const open = useArtwork();

  return (
    <button
      type="button"
      className={className}
      onClick={() => open?.(tile)}
      aria-label={tile.title ? `${tile.title} — open` : "Open artwork"}
    >
      {children}
    </button>
  );
}
