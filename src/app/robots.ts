import type { MetadataRoute } from "next";

import { ALT_HOME, absoluteUrl, siteUrl } from "@/data/site";

/**
 * Who may read the site, and where the map of it is.
 *
 * Everything is open, deliberately including the assistants — GPTBot,
 * ClaudeBot, PerplexityBot and the rest. A studio that wants to be named when
 * someone asks an assistant who does good brand identity work has to be
 * readable by the thing being asked, and blocking them buys nothing here:
 * there is no paywalled writing to protect, only work we want seen.
 *
 * The one exception is the alternate homepage, which shows the same work as
 * `/` in a different arrangement. It is real, and a visitor may land on it,
 * but it is not a second page's worth of anything — so it carries a canonical
 * to `/` and is kept out of the crawl rather than competing with it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ALT_HOME,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
