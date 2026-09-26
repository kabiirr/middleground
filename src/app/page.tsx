import { Intro, MOSAIC_DELAY } from "@/components/Intro";
import { Mosaic } from "@/components/Mosaic";
import { Monogram } from "@/components/Monogram";
import { Nav } from "@/components/Nav";
import { ShyBand } from "@/components/ShyBand";
import { PillLink } from "@/components/PillLink";
import { Stamps } from "@/components/Stamps";
import { StickyPill } from "@/components/StickyPill";
import { bookingUrl, site } from "@/data/site";

import styles from "./home.module.css";

/** Column three of the five, which the panel takes over. */
const PANEL_COLUMN = 2;

export default function Home() {
  return (
    <>
      <h1 className="visually-hidden">{site.name} — selected work</h1>

      <Intro id="home" />

      <div className={styles.panel}>
        {/* The mark, stamped wherever the column is clicked. */}
        <Stamps />

        <ShyBand className={styles.nav} intro>
          <Nav minimal />
        </ShyBand>
        <Monogram className={styles.mark} intro />
        <div className={styles.below}>
          <p className={styles.tagline} data-intro="rest">
            {site.tagline}
          </p>
          <div className={styles.cta} data-intro="rest" data-cta="">
            <PillLink href={bookingUrl} label="REACH OUT" />
          </div>
        </div>
      </div>

      <Mosaic
        skipColumn={PANEL_COLUMN}
        identity={false}
        delay={MOSAIC_DELAY}
        clearFoot
      />

      {/*
        The same way on, held at the foot of the screen once the panel has been
        scrolled past. It only ever shows on a phone, where the panel travels
        with the page instead of standing still beside the work.
      */}
      <StickyPill watch="[data-cta]" className={styles.held}>
        <PillLink href={bookingUrl} label="REACH OUT" />
      </StickyPill>
    </>
  );
}
