export const site = {
  name: "MiddleGround",
  tagline:
    "MiddleGround is a brand design studio that exists to build brands that make a meaningful mark in the world.",
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

/** Body copy on the about page (node 2058:57). */
export const aboutParagraphs = [
  "We are MiddleGround — a brand design studio built on a simple belief: great brand work happens where business ambition meets human connection.",
  "We work full-service across strategy, visual and digital, partnering with established and emerging businesses to create clear, distinctive work that lasts.",
  "We are highly craft-led, looking beyond the surface to build brands that make a meaningful mark in the world.",
];

export type ServicePill = {
  label: string;
  /** Fill colour, from the design. */
  colour: string;
  /** Position across the phrase, 0 to 1, so pills spread with its width. */
  x: number;
  /** Offset in design pixels from the top of the phrase's line. */
  y: number;
};

export type Service = {
  name: string;
  /** Revealed around the phrase while it is hovered. */
  pills: ServicePill[];
};

/**
 * Where the pills sit, taken from the design's hover state on "Identity
 * Systems" (nodes 2063:100 to 2063:116) and measured against that phrase's
 * 903px width. The same arrangement is reused for the other two services so
 * the strip reads consistently whichever one you are on.
 */
const PILL_LAYOUT: Omit<ServicePill, "label">[] = [
  { colour: "#efefe9", x: 0.0598, y: -14.8 },
  { colour: "#72b1f9", x: 0.0686, y: 105.2 },
  { colour: "#ffb893", x: 0.3078, y: 127.2 },
  { colour: "#b0e3c2", x: 0.5625, y: 0.2 },
  { colour: "#f2b6df", x: 0.7685, y: 127.2 },
  { colour: "#efefe9", x: 0.8482, y: -22.8 },
];

const pills = (...labels: string[]): ServicePill[] =>
  PILL_LAYOUT.map((position, index) => ({
    ...position,
    label: labels[index] ?? "",
  })).filter((pill) => pill.label !== "");

/**
 * The marquee strip on the about page (node 2058:58).
 *
 * Identity Systems carries the six pills exactly as drawn — the design repeats
 * "Research" four times there, which reads as placeholder copy worth varying.
 * The sets on the other two services are stand-ins: the design does not specify
 * them, so edit the labels here.
 */
export const services: Service[] = [
  {
    name: "Brand Strategy",
    pills: pills(
      "Research",
      "Positioning",
      "Naming",
      "Messaging",
      "Audit",
      "Architecture",
    ),
  },
  {
    name: "Identity Systems",
    pills: pills(
      "Research",
      "Naming",
      "Positioning",
      "Research",
      "Research",
      "Research",
    ),
  },
  {
    name: "Digital Experiences",
    pills: pills(
      "Research",
      "Art Direction",
      "Prototyping",
      "Interface",
      "Motion",
      "Build",
    ),
  },
];

export type ContactLink = {
  label: string;
  /**
   * Leave undefined and the entry renders as plain text. The social handles are
   * not spelled out as URLs in the design, so only the address is linked —
   * fill these in once the real profile URLs are confirmed, e.g.
   * href: "https://instagram.com/<handle>".
   */
  href?: string;
};

/** Contact details (node 2058:86). Rendered uppercase, as in the design. */
export const contactLinks: ContactLink[] = [
  { label: "hello@middleground.design", href: "mailto:hello@middleground.design" },
  { label: "IG: middleground.design" },
  { label: "x: middleground.design" },
  { label: "L’in: middleground.design" },
];
