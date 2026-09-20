import type { Metadata } from "next";

import { Intro, MOSAIC_DELAY } from "@/components/Intro";
import { Mosaic } from "@/components/Mosaic";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Selected work",
  description: site.tagline,
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
