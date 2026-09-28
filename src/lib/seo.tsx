import type { Metadata } from "next";

import {
  absoluteUrl,
  disciplines,
  founder,
  site,
  siteUrl,
  socialProfiles,
} from "@/data/site";

/**
 * Structured data — the description of the studio that is written for machines
 * rather than for the page.
 *
 * None of it changes what a visitor sees. It is what lets a search engine, or
 * anything answering a question by citing someone, know that MiddleGround is
 * one studio with one founder and three profiles, that these ten things are
 * what it does, and that this page is a piece of that same site — rather than
 * inferring all of it from the words and getting it wrong.
 *
 * Everything hangs off three stable ids. A node elsewhere refers to the studio
 * by `ORGANISATION`, never by repeating its details, so there is one
 * organisation in the graph however many pages are crawled.
 */
export const ORGANISATION = `${siteUrl}/#organisation`;
export const WEBSITE = `${siteUrl}/#website`;
export const FOUNDER = `${siteUrl}/#${founder.name.toLowerCase().replace(/\s+/g, "-")}`;

/**
 * A JSON-LD node written into the page.
 *
 * `<` is escaped on the way out. JSON.stringify will happily carry a `</script>`
 * inside a string straight through into the document, which would end the tag
 * early and leave whatever followed it running as markup.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * The studio itself, and the site it publishes — the two nodes every page
 * refers back to, so they are stated once, in the root layout.
 *
 * `sameAs` is the important part: it is what joins this domain to the accounts
 * posting the same work under the same name. Without it they are four separate
 * MiddleGrounds as far as anything reading the web is concerned.
 */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANISATION,
      name: site.name,
      alternateName: "MiddleGround Studio",
      url: siteUrl,
      email: site.email,
      description: site.description,
      slogan: site.tagline,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#logo`,
        url: absoluteUrl("/logo.svg"),
        caption: `${site.name} logotype`,
      },
      image: absoluteUrl("/opengraph-image"),
      sameAs: socialProfiles,
      founder: { "@id": FOUNDER },
      /*
       * A studio with no premises and no counter. Stated rather than left out:
       * "where are you" is a question a listing wants answered, and "wherever
       * the work is" is a better answer than silence.
       */
      areaServed: "Worldwide",
      /*
       * What the studio does, named as things that can be commissioned. This is
       * the same list the about page sets in type — one source, two readings.
       */
      knowsAbout: disciplines.map((discipline) => discipline.name),
      makesOffer: disciplines.map((discipline) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: discipline.name,
          provider: { "@id": ORGANISATION },
        },
      })),
    },
    {
      "@type": "Person",
      "@id": FOUNDER,
      name: founder.name,
      jobTitle: founder.role,
      worksFor: { "@id": ORGANISATION },
      knowsAbout: disciplines.map((discipline) => discipline.name),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE,
      url: siteUrl,
      name: site.name,
      description: site.description,
      publisher: { "@id": ORGANISATION },
      inLanguage: "en",
    },
  ],
};

/**
 * A page of this site, tied to the site and the studio behind it.
 *
 * `type` is what the page is for rather than what is on it — a CollectionPage
 * gathers things, an AboutPage is about the organisation, a ContactPage is how
 * to reach it. Naming it is what lets the page be answered with instead of
 * merely found.
 */
export function pageSchema({
  type = "WebPage",
  path,
  name,
  description,
}: {
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
  path: string;
  name: string;
  description: string;
}) {
  const url = absoluteUrl(path);

  return {
    "@type": type,
    "@id": `${url}#page`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE },
    about: { "@id": ORGANISATION },
    inLanguage: "en",
  };
}

/**
 * The metadata a page carries over and above what it inherits.
 *
 * It exists because `openGraph` does not merge. A page that sets so much as
 * its own `og:url` replaces the whole object it inherited, and the site name
 * and type set in the root layout vanish from that page alone — which is the
 * kind of thing nobody notices until a link to it unfurls wrong. So the three
 * fields are restated here, once, for every page to use.
 *
 * `canonical` is the other half: one page, one address, said out loud. Without
 * it a visit that arrives with a tracking parameter on the end is a second
 * page as far as a crawler is concerned.
 */
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  /** Omit on the homepage, which takes the default title rather than the template. */
  title?: string;
  description: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    /*
     * Title and description are left out deliberately: Next fills them from
     * the page's own, template and all, and repeating them here is one more
     * place for the two to drift apart.
     */
    openGraph: {
      type: "website",
      siteName: site.name,
      url: absoluteUrl(path),
    },
  };
}
