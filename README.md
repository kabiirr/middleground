# MiddleGround

Portfolio site for MiddleGround, a brand design studio. Built with Next.js (App
Router) and CSS Modules.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## The homepage

The homepage is a direct build of the Figma frame
([node 2068:176](https://www.figma.com/design/MCws2TSRqHQPUcELEVfnRx/Untitled--Copy-?node-id=2068-176)):
the same mosaic as the alternate homepage below, with the studio identity
lifted out of the grid and into a fixed panel.

The studio's mark, its line and the navigation take the middle column and stay
fixed while the mosaic runs past on either side. The mosaic carries no tiles in
that column — the design drops the two that were there — so nothing ever passes
behind the panel, and the name is simply always present. That is the same
problem the roaming block solves on the alternate homepage, answered by the
layout instead, which is why `/` runs with the roaming copy switched off.

The navigation leads the panel, 36px from the top edge as on every other page,
with the mark and the line below it. It is minimised to the page you are on,
with the rest folding out below on hover — the form about and contact carry
too; see below.

The mark is the circular monogram from the about page, turning as it does there.

## The mosaic

Both homepages are built on the same hand-placed 5-column mosaic, taken from
the Figma frame `Homepage`
([node 2056:2](https://www.figma.com/design/MCws2TSRqHQPUcELEVfnRx/Untitled--Copy-?node-id=2056-2)).

The layout has since been regularised on top of that frame: the five columns are
evenly spaced, and **every gap is 24px** — between columns, between tiles, and at
the join where the page loops. Column width falls out of that (`(1440 - 2×24 -
4×24) / 5 = 259.2`), and all five columns are built to the same total height, so
no column finishes short and opens a wider gap at the seam.

Tiles are stored as five column stacks in `src/data/projects.ts` and positioned
absolutely, with artwork applied in reading order. The canvas height is the
lowest tile edge with no margin beneath it — the page loops, so the next pass
brings its own top margin and that alone is the gap at the seam.

Every dimension is `calc(<design px> * var(--s))`, where `--s` is a single scale
factor defined in `src/app/layout.module.css`:

- at a 1440px viewport `--s` is exactly `1`, so the page matches Figma pixel for
  pixel;
- above that the whole composition zooms in step, preserving every proportion,
  capped at 1920px;
- below 1200px the zoom would push type past readability, so `--s` returns to
  `1` and the mosaic reflows into a 3 / 2 / 1 column masonry.

`--s` measures its own container (`100cqi`) rather than the viewport, so the
scrollbar never pushes the mosaic into horizontal overflow.

Each tile carries a `data-node-id` matching its Figma node, so any tile on the
page can be traced back to the design.

## The alternate homepage

`/alt` is the mosaic as the frame draws it, with the studio identity sitting in
the centre column and the navigation floating over the top row. Everything is
as it is on the homepage; only the placement differs.

The studio's name sits in the centre column, vertically centred on the first
screenful: its height is the logotype at full column width plus a 190px gap plus
three lines of tagline, so centring the block centres what you actually see. The
tile above it is sized to whatever space that leaves.

### The name follows you down the page

That fixed block scrolls away, and the mosaic runs on well past it. So a second
copy roams: whenever it leaves the viewport it is moved to another slot in the
grid — off screen, ahead of the direction of travel, and picked at random from
those close enough to reach shortly. Scroll on and the name turns up again
somewhere new, standing where a tile would otherwise be. Every move happens out
of sight, so the swap is never witnessed; what you see is the name appearing
somewhere in the grid.

The slots are not authored. The block is taller than any tile, but it may
overhang its host by up to a gutter at each end before it would touch the tile
above or below — so any tile within 48px of its height can hold it, centred.
That comes to ten across the canvas (`identitySlots`), spread closely enough
that the furthest you can ever be from one is under half a screen.

Which slot it moves to is chosen between those at a similar distance — within
200px of the nearest. Picking from everything in reach would sometimes send it
most of a screen away; always taking the nearest would make it predictable.
Choosing between the near ones gives the variety for nothing: over a full pass
every slot in the grid gets used, and the longest stretch without the name is
the same as if it always took the nearest.

Simulated across 300 randomised runs in each direction, that longest stretch is
184px against an 850px viewport. Before any of this the name was absent for
roughly 1400px of every pass.

One tile in column five is deliberately taller than its neighbours would
otherwise suggest: it is the only slot able to hold the name across the lower
half of the canvas, and without it the worst stretch more than triples.

The roaming copy repeats what the fixed one already says, so it is kept out of
the accessibility tree, and it stands down entirely below the desktop
breakpoint, where the reflowed mosaic has no fixed slots and the name already
leads the page.

## Openings

Both homepages open in order rather than all at once, through the same `Intro`
component. Whatever is marked `data-intro="mark"` arrives on its own in the
middle of the screen, holds a beat, then travels to its real place; everything
marked `data-intro="rest"` follows it in; the mosaic comes last, held back by
`MOSAIC_DELAY` so it overlaps the tail rather than waiting for silence.

On `/` the circular mark leads, and the line and its own navigation follow. On
`/alt` it is the logotype, and the line and navigation follow. The travel is
measured in viewport coordinates from where the element actually lands, so it
flies to the middle of what the visitor is looking at even if the browser has
restored the page part-way down.

The pieces are marked `data-intro` rather than `data-reveal`, which keeps them
out of the shared reveal driver so the sequence runs unopposed; the mosaic's
tiles keep their own entrance, which the driver already skips.

Two things the sequence has to be careful about:

- **It runs once a session.** The navigation lives above the routed content so
  it can survive a route change and carry its pill across; replaying its
  entrance every time you returned to the homepage would undo that. Coming back
  reveals everything instantly instead.
- **Only the first pass of the mosaic takes part.** The second exists to make
  the loop seamless, and its copy of the block sits far below the fold — hooking
  it into the opening would leave it hidden until something revealed it.

One consequence worth recording: the stage that wraps every routed page now
fades and nothing more. It used to move a little as well, which left a transform
behind — and a transformed ancestor becomes the containing block for anything
inside it set to `position: fixed`, quietly unpinning this panel after any
client-side navigation. The travel in a page transition belongs to the elements
themselves.

Two readings of the frame worth recording:

- The nav pill is centred on the column to the pixel, and the tagline is inset
  evenly, but the monogram sits 19.5px right of centre. That reads as drafting
  slack rather than intent, so it is centred here.
- The tagline's box is 235px wide rather than the column's 259, which runs it to
  four lines instead of three. That is carried across; the break holds with
  about 9px to spare at its tightest.

## The navigation

One component, in two arrangements, 36px from the top on every page.

- **The homepage, about and contact** take the minimised stack: the page you
  are on, with the other two folding out below it on hover. They fold out on
  focus too, so they can still be reached from the keyboard, and they collapse
  by height rather than being removed, so they stay in the accessibility tree
  throughout. The homepage carries it inside its own panel; about and contact
  take it from the header, centred on the page as the panel centres it.
- **The alternate homepage** keeps the row its frame draws, ending 36px from
  the right edge, floating over the top of the mosaic.

Each pill is as wide as its own label and the 14px of padding either side —
nothing states a width. The design draws an index on the active pill, **01** or
**02**, and sets the three active widths by hand to hold it; both are dropped
here, so the page you are on is marked by colour alone and the pill never
changes size. Nothing is lost at rest: the design's own resting widths are the
labels' own. It draws 68, 107 and 127; the text measures 67.4, 106.7 and 126.4
at the design width.

The header is a strip running the full width between the 36px margins, so the
stack can sit on the centre line while the row still ends at the right. It is
inert — without that it would swallow hovers meant for the mosaic beneath it.

The pill you are on leads the stack wherever it falls in the list. Left in
place, the items above it would grow as the rest unfolded and push it down the
page, which is a jump the homepage never had because HOME is already first.

On about and contact the stack opens over the mark, which sits 120px down —
the place the design gives it under a navigation in the corner. Three pills
will not fit in the 84px above it, so the mark yields while the navigation is
open rather than being covered by it. It can only do that because the entrance
hands opacity back to CSS when it finishes: the fade is keyed to
`data-revealed`, so it cannot smear the arrival.

Two arrangements the minimised form cannot serve:

- **A touch screen has no hover**, and tapping a pill navigates rather than
  opening the stack — so under `(hover: none)` it stands open.
- **Below the desktop breakpoint** the pages reflow and the header becomes a
  sticky strip, where a stack three pills deep would hold a fifth of the
  screen. There every page shows the full row.

## About and contact

Both are built from their Figma frames — about
([node 2058:46](https://www.figma.com/design/MCws2TSRqHQPUcELEVfnRx/Untitled--Copy-?node-id=2058-46))
and contact
([node 2058:73](https://www.figma.com/design/MCws2TSRqHQPUcELEVfnRx/Untitled--Copy-?node-id=2058-73)) —
and share the `--s` scale and the homepage's navigation.

They anchor rather than fix their height: the screen fills the viewport, the
monogram and copy hang off the top, and the oversized display type stays
pinned to the bottom edge. At 1440 x 850 that
resolves to exactly the Figma frame; on a taller window the composition still
reads correctly.

The about page's services strip is 2911px wide inside a 1440px frame, bleeding
off both edges, so it is built as a continuously scrolling ticker. Hovering a
phrase holds the strip still, fades its sister phrases back to half strength —
as the design draws them — and pops that service's disciplines out around it as
pills, which then trail the cursor, each at its own rate. Under
`prefers-reduced-motion` the ticker never moves, the pills arrive without the
travel, and the strip rests centred exactly where the design shows it.

Pill positions live in `PILL_LAYOUT` in `src/data/site.ts`, measured from the
design's hover state against that phrase's width, so they spread with whichever
phrase they belong to.

### Two things the design leaves open

- The services strip's pills are drawn only for Identity Systems, and four of
  the six read "Research" — placeholder copy worth varying. The labels on the
  other two services are stand-ins; edit them in `services`.
- The contact page lists social handles but no URLs, so only the email address
  is linked. Add `href` values in `contactLinks` once the real profile URLs are
  confirmed.

## Motion

GSAP drives the choreography, Lenis the scrolling — on GSAP's ticker, so there
is a single requestAnimationFrame loop and ScrollTrigger never reads a stale
scroll position.

- **Entrances.** Anything marked `data-reveal` starts hidden and is animated in:
  the mosaic in a diagonal stagger ordered by distance from the top-left, other
  pages in a simple sequence. Once an element arrives it gains `data-revealed`,
  which drops the inline opacity and hands the element back to CSS — that is what
  lets hover states work afterwards.
- **Route changes.** The navigation lives in the root layout and never unmounts,
  so the active pill takes its colour on between pages rather than cutting. Nav
  clicks are intercepted to play the outgoing content out before the push, and
  the incoming content back in. Modified and middle clicks are left alone.

  The pill does not wait for the route. On click the destination is published as
  `pending`, and the navigation styles itself from that — so the pill starts
  changing on the click rather than a third of a second later, once the exit
  animation and the route resolve have both finished. Only the look runs ahead:
  `aria-current` keeps reporting where the visitor actually is until the route
  commits, and a separate `data-active` carries the appearance.
- **Scroll.** The homepage loops endlessly. The mosaic is rendered twice, one
  pass above the other; once the page has scrolled past the height of a single
  pass, the scroll position is moved back by exactly that distance. The second
  pass is then showing what the first was, pixel for pixel, so the jump is
  invisible and the mosaic reads as continuous. Where smooth scrolling is
  running, Lenis's own `animatedScroll` and `targetScroll` are shifted alongside
  the window, which preserves the visitor's momentum through the seam —
  `scrollTo` would stop the scroll dead at the join.

  Two details make the loop hold up. The period is measured between the two
  passes with `getBoundingClientRect`, not `offsetHeight`, because the canvas
  height is fractional and rounding it would leave the seam a pixel out; the
  residual is about 0.2px, which is the browser's own scroll quantisation and
  the floor for any approach built on native scroll. And the last row's lower
  edges are deliberately close together, since that row butts against row one of
  the next pass — a ragged edge there would open a gap far wider than the
  mosaic's own rhythm. All five columns are therefore built to the same total
  height, and the canvas carries no bottom margin, so the join is 24px like
  every other gap.

- **Parallax.** The five columns drift at different rates, measured from each
  tile's position in the viewport rather than from overall scroll progress. That
  is what keeps it seamless across the loop — at the wrap the duplicate tiles sit
  exactly where the originals were, so they inherit the same offsets instead of
  snapping to a new value. Desktop only.
- **Hover.** The hovered tile scales its image while its neighbours recede and
  the caption slides up.
- **Display type.** `SplitText` rolls each glyph up out of its own clipping
  mask, keeping the whole string as a single `aria-label`.

- **The mark.** The circular monogram appears on both the about and contact
  pages and turns slowly on the spot, one revolution every 28 seconds. The
  rotation is on the artwork rather than its wrapper: the wrapper plays the
  page's entrance, and GSAP clears the individual transform properties when it
  takes over an element's transform, so a rotation set there would be wiped the
  moment the entrance began.

A related trap, worth knowing about before adding anything else to these pages:
nothing that plays the entrance can be centred with `translate`. GSAP writes
`translate: none` when it takes the element's transform, which drops a
translate-centred block half its width sideways as soon as the animation
finishes. The blocks on both pages are centred by offset — `left: calc(50% -
<half the width>)` — for exactly that reason.

Two things are deliberate rather than incidental:

- Entrances wait for `document.visibilityState === "visible"`. Browsers suspend
  requestAnimationFrame in a hidden tab, so a timeline started there never
  advances and the content would sit at opacity 0 until the tab was focused.
- The hidden start states live in CSS but only apply once an inline script in
  the document head has confirmed JavaScript is running, so the site still
  renders completely without it.

`prefers-reduced-motion` is honoured throughout: smooth scrolling is not
started, transitions are dropped, entrances resolve instantly, and the marquee
rests centred on its first group — the crop the design shows.

## Artwork

Tiles take either a still or a silent looping clip:

```ts
{ id: "r1-c1", rect: { ... }, media: { kind: "image", src: "/images/artemis-01.jpg" },
  alt: "Artemis — brand identity for a fossil identification app",
  title: "ARTEMIS",        // shown on hover
  href: "/work/artemis" }  // optional case study link
```

Both are cropped with `object-fit: cover`, so any aspect ratio works — though
artwork close to the tile's own proportions loses least at the edges. Stills go
through `next/image` (a 1.4MB source is served at roughly 47KB). Clips play only
while on screen and never when `prefers-reduced-motion` is set; they have no
poster frames, so the first frame stands in.

All thirty-four tiles are filled, across eight projects — Artemis, Outsmarted My
Molars, Glass Banking, DABA, MO.FOOD, woka, Tech for the World Forum and Nomadi
— plus five silent clips. Projects are interleaved rather than grouped so the
grid mixes as you scroll; reorder by moving entries in `ARTWORK`, which applies
to the tiles in reading order.

There are thirty-five pieces for thirty-four tiles, so `artemis-12.jpg` is held
back — Artemis is the largest set. Swap it in for any entry in `ARTWORK`.

### Worth confirming

- **Provenance.** The files arrived named `SaveClip.App_*`, which is an Instagram
  downloader. If any of it is reference or inspiration rather than MiddleGround's
  own work, it should not sit on the studio's portfolio as its own.
- **Alt text is per image for Glass Banking, DABA and MO.FOOD**, written from
  the artwork itself. Artemis and Molars still share one description per project
  — accurate but coarse, and worth a line each from someone who knows the work.
- **`motion-04.mp4` is 3.9MB**, far larger than the other clips. It is only
  fetched when it scrolls into view, so it does not weigh on first load, but it
  is worth re-encoding.

## Type

Three families, all self-hosted:

| Family | Used for | Source |
| --- | --- | --- |
| Cartograph CF Light | navigation, contact details | Connary Fagen |
| Articulat CF Regular | body copy | Connary Fagen |
| Miller Display Italic | the large display type | Font Bureau |

The originals were converted to `.woff2` into `public/fonts`; the `@font-face`
rules are at the top of `src/app/globals.css`. All three are preloaded in
`src/app/layout.tsx`, since each is above the fold on one page or another.

To add a weight, convert it alongside the others:

```bash
python3 -c "
from fontTools.ttLib import TTFont
f = TTFont('ArticulatCF-Bold.otf'); f.flavor = 'woff2'
f.save('public/fonts/ArticulatCF-Bold.woff2')"
```

