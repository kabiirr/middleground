import type { Metadata } from "next";

import { Marquee } from "@/components/Marquee";
import { Monogram } from "@/components/Monogram";
import { Stamps } from "@/components/Stamps";
import { aboutParagraphs, services, site } from "@/data/site";

import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: aboutParagraphs[0],
};

export default function About() {
  return (
    <div className={styles.screen}>
      <h1 className="visually-hidden">About {site.name}</h1>

      <Stamps />

      <Monogram className={styles.monogram} />

      <div className={styles.copy} data-reveal="">
        {aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <Marquee
        className={styles.marquee}
        services={services}
        label="What we do"
        reveal
      />
    </div>
  );
}
