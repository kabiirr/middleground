import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";

import { Monogram } from "@/components/Monogram";
import { CursorPill } from "@/components/CursorPill";
import { PillLink } from "@/components/PillLink";
import { SectionLink } from "@/components/SectionLink";
import { PortraitReveal } from "@/components/PortraitReveal";
import { Stamps } from "@/components/Stamps";
import { Torch } from "@/components/Torch";
import {
  aboutColumns,
  aboutInvitation,
  aboutLead,
  aboutStatement,
  bookingUrl,
  disciplinePairs,
  site,
} from "@/data/site";

import styles from "./about.module.css";

/**
 * The fills the cursor pill draws from — the tones from globals.css, named here
 * in the order they are listed there.
 */
const PILL_TONES = [
  "var(--color-tone-paper)",
  "var(--color-tone-lilac)",
  "var(--color-tone-sky)",
  "var(--color-tone-coral)",
  "var(--color-tone-mint)",
  "var(--color-tone-butter)",
  "var(--color-tone-blossom)",
];

export const metadata: Metadata = {
  title: "About",
  description: aboutStatement,
};

export default function About() {
  return (
    <div className={styles.screen}>
      <h1 className="visually-hidden">About {site.name}</h1>

      <Stamps />

      <Monogram className={styles.mark} />

      <p className={styles.statement} data-reveal="">
        {aboutStatement}
      </p>

      <div className={styles.columns} data-reveal="">
        {aboutColumns.map((column) => (
          <p key={column}>{column}</p>
        ))}
      </div>

      {/*
        One run of type rather than a list of rows: letting it wrap keeps the
        same reading at every width instead of only at 1440.

        The whole run leads to the same place, and the words sit inside the
        link rather than under a sheet laid over them — which is what lets each
        one answer to the pointer on its own.
      */}
      <Torch
        className={styles.services}
        palette={PILL_TONES}
        parts="[data-part]"
      >
        {/*
          Out to the calendar rather than on through the site, which is what the
          pill over it says: a plain link, since there is no page of our own to
          play out of on the way.
        */}
        <a
          className={styles.servicesTarget}
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
        >
          <p className={styles.disciplines} data-reveal="">
            {disciplinePairs.map((pair, index) => (
              <Fragment key={pair[0].name}>
                {/*
                  Two disciplines that stay on a line together. The run is one
                  piece of type, not a list of rows, and left to itself it
                  breaks wherever the width runs out — which is how one ends up
                  hanging alone. Holding them in twos gives the wrap the only
                  places it may break, and the rows come out even.
                */}
                <span className={styles.pair}>
                  {pair.map((discipline, half) => (
                    <Fragment key={discipline.name}>
                      <span
                        className={
                          discipline.bright
                            ? `${styles.discipline} ${styles.bright}`
                            : styles.discipline
                        }
                        // What the pill watches for: a new part under
                        // the pointer is what draws it a new colour.
                        data-part=""
                      >
                        {discipline.name}
                        {index < disciplinePairs.length - 1 || half === 0 ? (
                          <span className={styles.slash}>/</span>
                        ) : null}
                      </span>
                      {/*
                        Where the pair may break once the page is narrow enough
                        that it has to — see .pair in the stylesheet.
                      */}
                      {half === 0 ? <wbr /> : null}
                    </Fragment>
                  ))}
                </span>
                <wbr />
              </Fragment>
            ))}
          </p>
        </a>

        {/* The cursor, while the pointer is among the disciplines. */}
        <CursorPill label="BOOK A CALL" />
      </Torch>

      <section className={styles.director}>
        <span className={styles.rule} aria-hidden="true" />

        <PortraitReveal className={styles.portrait}>
          <div data-reveal="" className={styles.portraitReveal}>
            <Image
              src="/images/abel-portrait.jpg"
              alt="Abel Idume, brand designer and creative director"
              fill
              sizes="(max-width: 1199px) 100vw, 40vw"
              className={styles.portraitImage}
            />
            {/*
              The same frame, read in blocks. Shown only through the window the
              pointer carries, and no more than decoration — the portrait
              beneath it is the one that is described.
            */}
            <Image
              src="/images/abel-portrait-pixel.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 1199px) 100vw, 40vw"
              className={styles.portraitPixels}
            />
          </div>
        </PortraitReveal>

        <p className={styles.lead} data-reveal="">
          {aboutLead}
        </p>
      </section>

      <Torch
        className={styles.invitation}
        palette={PILL_TONES}
        parts="[data-part]"
        trail
      >
        {/*
          The words are the way through. The whole section is the link, so
          wherever the pointer is when it decides, it lands on the same place —
          and the link reads as its own words rather than as a bare target laid
          over the page.
        */}
        <SectionLink href="/contact" className={styles.invitationTarget}>
          <span className={styles.invitationLine} data-part="">
            {aboutInvitation}
          </span>
        </SectionLink>

        {/*
          The cursor, while the pointer is in here: the pill the design draws,
          carried by the pointer instead of sitting on the page.
        */}
        <CursorPill label="CONTACT US" />

        {/* A touch screen has no cursor to replace, so it keeps the pill. */}
        <div className={styles.invitationPill} data-reveal="">
          <PillLink href="/contact" label="CONTACT US" />
        </div>
      </Torch>
    </div>
  );
}
