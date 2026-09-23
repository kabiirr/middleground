import { Intro, MOSAIC_DELAY } from "@/components/Intro";
import { Mosaic } from "@/components/Mosaic";
import { Monogram } from "@/components/Monogram";
import { Nav } from "@/components/Nav";
import { PillLink } from "@/components/PillLink";
import { site } from "@/data/site";

import styles from "./home.module.css";

/** Column three of the five, which the panel takes over. */
const PANEL_COLUMN = 2;

export default function Home() {
  return (
    <>
      <h1 className="visually-hidden">{site.name} — selected work</h1>

      <Intro id="home" />

      <div className={styles.panel}>
        <div className={styles.nav} data-intro="rest">
          <Nav minimal />
        </div>
        <Monogram className={styles.mark} intro />
        <div className={styles.below}>
          <p className={styles.tagline} data-intro="rest">
            {site.tagline}
          </p>
          <div className={styles.cta} data-intro="rest">
            <PillLink href="/contact" label="CONTACT US" />
          </div>
        </div>
      </div>

      <Mosaic
        skipColumn={PANEL_COLUMN}
        identity={false}
        delay={MOSAIC_DELAY}
      />
    </>
  );
}
