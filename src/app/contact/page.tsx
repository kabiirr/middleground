import type { Metadata } from "next";

import { Monogram } from "@/components/Monogram";
import { SplitText } from "@/components/SplitText";
import { Stamps } from "@/components/Stamps";
import { contactLinks, site } from "@/data/site";

import styles from "./contact.module.css";

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

      <SplitText as="h1" className={styles.headline} text="Reach out" delay={0.15} />
    </div>
  );
}
