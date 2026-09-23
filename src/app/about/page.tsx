import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";

import { Monogram } from "@/components/Monogram";
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
  disciplines,
  site,
} from "@/data/site";

import styles from "./about.module.css";

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
      <Torch className={styles.services}>
        <SectionLink href="/contact" className={styles.servicesTarget}>
          <p className={styles.disciplines} data-reveal="">
            {disciplines.map((discipline, index) => (
              <Fragment key={discipline}>
                <span className={styles.discipline}>
                  {discipline}
                  {index < disciplines.length - 1 ? (
                    <span className={styles.slash}>/</span>
                  ) : null}
                </span>
                {/*
                  The only place a line may break. A slash is no break
                  opportunity of its own and a discipline holds together, so
                  without this the run is one unbreakable word that overshoots
                  the column — and with it the five lines fall exactly where
                  the design sets them.
                */}
                <wbr />
              </Fragment>
            ))}
          </p>
        </SectionLink>

        {/* The cursor, while the pointer is among the disciplines. */}
        <span className={styles.cursor} aria-hidden="true">
          BOOK A CALL
        </span>
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

      <Torch className={styles.invitation}>
        {/*
          The words are the way through. The whole section is the link, so
          wherever the pointer is when it decides, it lands on the same place —
          and the link reads as its own words rather than as a bare target laid
          over the page.
        */}
        <SectionLink href="/contact" className={styles.invitationTarget}>
          {/*
            Outlined rather than filled, as the design draws it: the fill is
            transparent and the letters are carried by their stroke alone.
          */}
          <span className={styles.invitationLine}>{aboutInvitation}</span>
          {/*
            The same line, filled, shown only where the light falls on it. A
            second copy rather than a change of colour: a mask can reveal one
            layer over another, but it cannot fill in a stroke.
          */}
          <span className={styles.invitationLit} aria-hidden="true">
            {aboutInvitation}
          </span>
        </SectionLink>

        {/*
          The cursor, while the pointer is in here: the pill the design draws,
          carried by the pointer instead of sitting on the page.
        */}
        <span className={styles.cursor} aria-hidden="true">
          CONTACT US
        </span>

        {/* A touch screen has no cursor to replace, so it keeps the pill. */}
        <div className={styles.invitationPill} data-reveal="">
          <PillLink href="/contact" label="CONTACT US" />
        </div>
      </Torch>
    </div>
  );
}
