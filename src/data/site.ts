export const site = {
  name: "MiddleGround",
  tagline:
    "MiddleGround is a brand design studio building brands that make a meaningful mark in the world.",
};

/** The homepage, which carries its own navigation inside the fixed panel. */
export const HOME = "/";

/** The alternate homepage, which takes the navigation in the page header. */
export const ALT_HOME = "/alt";

export type NavItem = {
  label: string;
  href: string;
};

/** Each pill is as wide as its own label; nothing else sets its size. */
export const navItems: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT US", href: "/contact" },
];

/*
 * The about page (node 2075:2). A long scroll: a statement, two columns
 * beneath it, the disciplines, who leads the work, and an invitation.
 */

/** The statement that opens the page (node 2075:5). */
export const aboutStatement =
  "We are MiddleGround — a brand design studio built on a simple belief: great brand work happens where business ambition meets human connection.";

/** The two columns under the statement (nodes 2075:33 and 2075:34). */
export const aboutColumns = [
  "We work closely with founders and teams at defining moments, from ambitious new ventures to thoughtful reinventions. We ask the right questions, explore possibilities together, and then create something that feels true to the business, relevant to its audience, and built to move it forward.",
  "We work full-service across strategy, visual and digital, creating work that positions our clients for the future, help them scale globally, and make a meaningful mark in the world.",
];

/**
 * What the studio does (node 2075:35), read as one run of type — all of it the
 * serif italic, with the slashes between as the only sans in the run.
 *
 * Five of them stand in white and the rest in grey, which is the division the
 * design draws with its two typefaces, kept here as a difference of tone alone.
 *
 * They are read two at a time, and each two hold together on a line. That is
 * what keeps the run even: left to itself it wraps wherever the width happens
 * to run out, which is how a discipline ends up standing alone on a line of its
 * own. Keep the count even when the list is changed.
 */
export type Discipline = {
  name: string;
  /** Standing in white rather than waiting for the pointer. */
  bright?: boolean;
};

export const disciplines: Discipline[] = [
  { name: "Brand Identity", bright: true },
  { name: "Editorial" },
  { name: "Packaging" },
  { name: "Strategy", bright: true },
  { name: "Websites", bright: true },
  { name: "Tone of Voice" },
  { name: "Naming" },
  { name: "3D & Motion", bright: true },
  { name: "Creative Direction", bright: true },
  { name: "Type Design" },
];

/**
 * The same list, two at a time — which is how it is set, and how it reads.
 */
export const disciplinePairs: Discipline[][] = disciplines.reduce<
  Discipline[][]
>((pairs, discipline, index) => {
  if (index % 2 === 0) pairs.push([discipline]);
  else pairs[pairs.length - 1].push(discipline);
  return pairs;
}, []);

/** Where a call is booked, which is what the disciplines lead to. */
export const bookingUrl = "https://calendly.com/abelidume/meet-with-abel";

/** Who leads the work (node 2075:51). */
export const aboutLead =
  "MiddleGround is led by brand designer and creative director Abel Idume. With 8 years of experience across brand, visual, motion, and digital design, he brings a broad perspective to every project, supported by a trusted network of specialists when needed. This keeps every engagement focused and hands-on, with Abel personally leading the work from start to finish.";

/** The invitation at the foot of the page (node 2075:4). */
export const aboutInvitation = "Get in touch";

export type ContactLink = {
  label: string;
  /** Leave undefined and the entry renders as plain text rather than a link. */
  href?: string;
};

/**
 * Contact details (node 2058:86). Rendered uppercase, as in the design, which
 * spells the handles out as plain text; the profiles are linked here.
 *
 * The addresses are the canonical ones. The share links these came from
 * carried tracking parameters — `?s=11` on X, a `?stkn=` share token on
 * Instagram — which identify whoever copied them and have no business in a
 * page anyone can open.
 */
export const contactLinks: ContactLink[] = [
  /* First, since a time in the diary is the readiest way in. */
  { label: "Book a call", href: bookingUrl },
  {
    label: "Enquiries: hello@middleground.design",
    href: "mailto:hello@middleground.design",
  },
  { label: "IG: @by_middleground", href: "https://www.instagram.com/by_middleground" },
  { label: "x: @bymiddleground", href: "https://x.com/bymiddleground" },
  {
    label: "L’in: @bymiddleground",
    href: "https://www.linkedin.com/company/bymiddleground/",
  },
];
