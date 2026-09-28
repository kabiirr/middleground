import type { Metadata } from "next";

import { CursorPill } from "@/components/CursorPill";
import { Monogram } from "@/components/Monogram";
import { PillTrail } from "@/components/PillTrail";
import { SplitText } from "@/components/SplitText";
import { Stamps } from "@/components/Stamps";
import { Torch } from "@/components/Torch";
import {
  bookingUrl,
  contactLinks,
  disciplines,
  founder,
  site,
  socialProfiles,
} from "@/data/site";
import { JsonLd, ORGANISATION, pageMetadata, pageSchema } from "@/lib/seo";

import styles from "./contact.module.css";

/**
 * The fills the cursor pill draws from — the tones from globals.css, named here
 * in the order they are listed there.
 */
/** What the pills the cursor drops are called: the work itself. */
const SERVICES = disciplines.map((discipline) => discipline.name);

const PILL_TONES = [
  "var(--color-tone-paper)",
  "var(--color-tone-lilac)",
  "var(--color-tone-sky)",
  "var(--color-tone-coral)",
  "var(--color-tone-mint)",
  "var(--color-tone-butter)",
  "var(--color-tone-blossom)",
];



export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact the Studio",
  /*
   * "Get in touch with MiddleGround" says nothing a result list can act on.
   * What someone searching for a studio wants to know is that there is a way
   * in and what it costs them — a call, an email, a reply — so the description
   * is the invitation rather than a label for the page.
   */
  description: `Start a brand project with ${site.name}. Book a call with ${founder.name}, or reach the studio by email — new work, collaborations and speaking all welcome.`,
});

/**
 * How to reach the studio, said in the markup as well as on the page.
 *
 * The `contactPoint` is the part that travels: it is what a knowledge panel
 * shows, and what an assistant quotes when someone asks how to get hold of
 * MiddleGround, without either having to guess which of the five lines on the
 * page is the address.
 */
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...pageSchema({
        type: "ContactPage",
        path: "/contact",
        name: `Contact ${site.name}`,
        description: `Book a call with ${founder.name} or email the studio.`,
      }),
      mainEntity: { "@id": ORGANISATION },
    },
    {
      "@type": "Organization",
      "@id": ORGANISATION,
      email: site.email,
      sameAs: socialProfiles,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "New business",
        email: site.email,
        url: bookingUrl,
        availableLanguage: "English",
      },
    },
  ],
};

export default function Contact() {
  return (
    <div className={styles.screen}>
      <JsonLd schema={schema} />

      {/*
        The page's heading, read rather than seen. "Reach out" is the headline
        the design draws and it is the right words on the page, but it names
        neither the studio nor what the page is for — which is all a result
        list has to go on.
      */}
      <h1 className="visually-hidden">Contact {site.name}</h1>

      <Stamps />

      <Monogram className={styles.monogram} />

      <h2 className="visually-hidden">Where to find {site.name}</h2>

      <ul className={styles.details} data-reveal="">
        {contactLinks.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a
                href={link.href}
                /* A profile is somewhere else; the address is not. */
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ) : (
              link.label
            )}
          </li>
        ))}
      </ul>

      {/*
        The headline is the way to a time in the diary, as the invitation is on
        the about page: the pointer that reaches it is handed a pill instead of
        a cursor, and the words themselves are the link.
      */}
      <Torch
        className={styles.reach}
        palette={PILL_TONES}
        parts="[data-part]"
        trail
      >
        <a
          className={styles.reachTarget}
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          data-part=""
        >
          <SplitText
            as="h2"
            className={styles.headline}
            text="Reach out"
            delay={0.15}
          />
        </a>

        {/* What the cursor leaves behind it, and what becomes of it. */}
        <PillTrail labels={SERVICES} tones={PILL_TONES} />

        <CursorPill label="BOOK A CALL" />
      </Torch>
    </div>
  );
}
