import type { Metadata } from "next";

import { Monogram } from "@/components/Monogram";
import { SplitText } from "@/components/SplitText";
import { contactLinks, site } from "@/data/site";

import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function Contact() {
  return (
    <div className={styles.screen}>
      <Monogram className={styles.monogram} />

      <ul className={styles.details} data-reveal="">
        {contactLinks.map((link) => (
          <li key={link.label}>
            {link.href ? <a href={link.href}>{link.label}</a> : link.label}
          </li>
        ))}
      </ul>

      <SplitText as="h1" className={styles.headline} text="Reach out" delay={0.15} />
    </div>
  );
}
