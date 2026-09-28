import { Intro, MOSAIC_DELAY } from "@/components/Intro";
import { Mosaic } from "@/components/Mosaic";
import { Monogram } from "@/components/Monogram";
import { Nav } from "@/components/Nav";
import { ShyBand } from "@/components/ShyBand";
import { PillLink } from "@/components/PillLink";
import { Stamps } from "@/components/Stamps";
import { StickyPill } from "@/components/StickyPill";
import { absoluteUrl, bookingUrl, site } from "@/data/site";
import { projectIndex } from "@/data/projects";
import {
  FOUNDER,
  JsonLd,
  ORGANISATION,
  pageMetadata,
  pageSchema,
} from "@/lib/seo";

import type { Metadata } from "next";

import styles from "./home.module.css";

/** Column three of the five, which the panel takes over. */
const PANEL_COLUMN = 2;

/*
 * No title of its own: the homepage takes the default rather than putting a
 * name in front of the studio's.
 */
export const metadata: Metadata = pageMetadata({
  path: "/",
  description: site.description,
});

/**
 * What this page is, and what is on it.
 *
 * The mosaic is the studio's portfolio, and a wall of images is the one thing
 * a crawler cannot read. Listing the work here — each project once, with what
 * it was and when — is how "brand identity for a fintech" becomes something
 * the page can be found by, rather than something only a visitor can see.
 */
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...pageSchema({
        type: "CollectionPage",
        path: "/",
        name: `${site.name} — Brand Design Studio`,
        description: site.description,
      }),
      mainEntity: {
        "@type": "ItemList",
        name: `Selected work by ${site.name}`,
        numberOfItems: projectIndex.length,
        itemListElement: projectIndex.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.title,
            genre: project.discipline,
            ...(project.year ? { dateCreated: project.year } : {}),
            ...(project.image
              ? { image: absoluteUrl(project.image), abstract: project.alt }
              : {}),
            creator: { "@id": ORGANISATION },
            author: { "@id": FOUNDER },
          },
        })),
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd schema={schema} />

      {/*
        The page's one heading. The studio's name is set in the panel as
        artwork rather than as type, so the heading that names it and says what
        it is stands here instead, read rather than seen.
      */}
      <h1 className="visually-hidden">{site.name} — brand design studio</h1>

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

      <h2 className="visually-hidden">Selected work</h2>

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
