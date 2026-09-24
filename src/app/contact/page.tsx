import type { Metadata } from "next";

import { CursorPill } from "@/components/CursorPill";
import { Monogram } from "@/components/Monogram";
import { SplitText } from "@/components/SplitText";
import { Stamps } from "@/components/Stamps";
import { Torch } from "@/components/Torch";
import { contactLinks, site } from "@/data/site";

import styles from "./contact.module.css";

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

/** The address the page is for, which the headline is a way to. */
const EMAIL = contactLinks[0];

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function Contact() {
  return (
    <div className={styles.screen}>
      <Stamps />

      <Monogram className={styles.monogram} />

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
        The headline is the way to write, as the invitation is on the about
        page: the pointer that reaches it is handed a pill instead of a cursor,
        and the words themselves are the link.
      */}
      <Torch
        className={styles.reach}
        palette={PILL_TONES}
        parts="[data-part]"
        trail
      >
        <a className={styles.reachTarget} href={EMAIL.href} data-part="">
          <SplitText
            as="h1"
            className={styles.headline}
            text="Reach out"
            delay={0.15}
          />
        </a>

        <CursorPill label="EMAIL US" />
      </Torch>
    </div>
  );
}
