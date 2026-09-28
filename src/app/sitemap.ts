import type { MetadataRoute } from "next";

import { tiles } from "@/data/projects";
import { absoluteUrl } from "@/data/site";

/**
 * The pages worth crawling, which is every page the navigation offers.
 *
 * The alternate homepage is not among them: it is the same work as `/`, and
 * listing it would be asking for the two to be weighed against each other.
 *
 * `lastModified` is the build, since the site is static and a deploy is the
 * only thing that changes it. The day a page's content comes from somewhere
 * with its own dates — a case study, say — that page should carry its own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  /*
   * Every still in the mosaic, listed against the page that shows it.
   *
   * This is the part that matters most for a studio: the work is images, and
   * image search is where a lot of people looking for a brand designer
   * actually look. Left to itself a crawler finds these through the markup
   * eventually; naming them here is what gets them crawled rather than
   * happened upon. The clips are left out — a video entry has to carry a
   * thumbnail and a description, and the mosaic's loops have neither.
   */
  const artwork = Array.from(
    new Set(
      tiles.flatMap((tile) =>
        tile.media?.kind === "image" ? [absoluteUrl(tile.media.src)] : [],
      ),
    ),
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: artwork,
    },
    {
      url: absoluteUrl("/about"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
      images: [absoluteUrl("/images/abel-portrait.jpg")],
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
