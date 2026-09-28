import type { Metadata } from "next";

import { Intro, MOSAIC_DELAY } from "@/components/Intro";
import { Mosaic } from "@/components/Mosaic";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * The same work as the homepage, arranged differently — which is exactly the
 * kind of page that splits a site against itself in search.
 *
 * So it says so: the canonical points at `/`, and the page asks not to be
 * indexed while still letting the crawler follow the links out of it. Anyone
 * who has the address still gets the page; it simply does not stand as a
 * second homepage. robots.ts keeps it out of the crawl for the same reason.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/",
    title: "Selected work",
    description: site.description,
  }),
  robots: { index: false, follow: true },
};

export default function AlternateHome() {
  return (
    <>
      <Intro id="alt" />
      <h1 className="visually-hidden">{site.name} — selected work</h1>
      <Mosaic delay={MOSAIC_DELAY} />
    </>
  );
}
