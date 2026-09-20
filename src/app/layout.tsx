import type { Metadata, Viewport } from "next";

import { SiteNav } from "@/components/SiteNav";
import {
  NavigationProvider,
  PageTransition,
} from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/data/site";

import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Brand Design Studio`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name} — Brand Design Studio`,
    description: site.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  /*
   * The canvas is black to the edges, and this is also what makes
   * env(safe-area-inset-*) report anything at all on a phone with a cutout —
   * the header and the pages anchored to the bottom edge read those.
   */
  viewportFit: "cover",
};

/**
 * Marks the document as scripted before first paint, so the entrance states in
 * globals.css only apply when there is JavaScript to animate them away again.
 */
const MARK_SCRIPTED = 'document.documentElement.classList.add("js")';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* Browser extensions inject attributes onto html and body before
       hydration, which React would otherwise report as a mismatch. */
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_SCRIPTED }} />
        {/*
          Every face is above the fold on one page or another, so all three are
          preloaded to avoid a flash of fallback text on first paint.
        */}
        <link
          rel="preload"
          href="/fonts/CartographCF-Light.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/ArticulatCF-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MillerDisplay-Italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">
          Skip to work
        </a>
        <SmoothScroll />
        {/*
          The navigation lives here rather than inside each page so it survives
          every route change. That is what lets the active pill grow, shrink and
          change colour between pages instead of cutting.
        */}
        <NavigationProvider>
          <div className={styles.page}>
            <header className={styles.header}>
              <SiteNav />
            </header>
            <main id="main">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </NavigationProvider>
      </body>
    </html>
  );
}
