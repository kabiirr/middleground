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
with the mark, the line and a way on below it. The mark is 120 design pixels
across, and `--mark-size`, `--mark-top` and `--line-gap` on the panel are what
place everything under it: the line reads all three and holds `--line-gap`
below the mark's foot — 190px, the same the studio's name holds above its own
line everywhere else — so resizing the mark moves the line with it.

The line and the CONTACT US pill sit in one column running from the line's
place down to 56px off the foot of the panel, the pill taking whatever space
is left over. They cannot be placed independently: the line is measured down
from the top and the pill up from the bottom, and on a short window the two
would meet in the middle. Held in a column, the pill follows the line down
instead, never closer than 40px to it.

Past a certain ratio even that runs out of room, so beyond 1440 / 780 the mark
comes up to 180 and the gap below it closes to 150 — the same composition,
tighter. A ratio rather than a height, because the panel scales with the
width: a tall enough window at 1440 is a short one at 1920. It is minimised to the page you are on,
with the rest folding out below on hover — the form about and contact carry
too; see below.

The mark is the circular monogram from the about page, turning as it does there.

## The mosaic

Both homepages are built on the same hand-placed 5-column mosaic, taken from
the Figma frame `Homepage`
([node 2056:2](https://www.figma.com/design/MCws2TSRqHQPUcELEVfnRx/Untitled--Copy-?node-id=2056-2)).

The layout has since been regularised on top of that frame: the five columns are
evenly spaced, and **every gap is 24px** — above, below and either side of every
tile, and at the join where the page loops. Column width falls out of that
(`(1440 - 2×24 - 4×24) / 5 = 259.2`), and all five columns are built to the same
total height, so no column finishes short and opens a wider gap at the seam.
`GUTTER` in `src/data/design.ts` is the only number to change to open the grid
up or close it; everything else is measured from it.

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
  `1` and the mosaic reflows into a 3 / 2 column masonry.

`--s` measures its own container (`100cqi`) rather than the viewport, so the
scrollbar never pushes the mosaic into horizontal overflow.

A tile is a piece and its title together, and it is tiles the 24px is measured
between: the title travels with the work it names rather than floating in the
space between two of them. The frame takes the height the grid gives it less a
24px band and the title stands in that band, so the grid's rhythm is exactly as
drawn — a title that added height would push every tile into the one below it,
and on the desktop canvas, where tiles sit at absolute coordinates, they would
simply overlap. The piece above a title therefore ends 48px from the one below
it rather than 24: the 24 is between tiles, and 24 of it is the title's own.

Clicking a tile opens its artwork over the page, whole rather than cropped to
the grid. `ArtworkProvider` wraps the mosaic and holds the one piece that can
be open at a time; the overlay has to sit above the grid rather than inside
the tile it came from, which crops its own artwork by definition. A few things
it has to get right:

- **It is a button, not a link.** There is no page to go to, and a link would
  say there was. A tile with an `href` still leads to its case study instead.
- **Only the first pass is interactive.** The duplicate that makes the loop
  seamless is hidden from screen readers, and leaving buttons in it would put
  a second set of every tile in the tab order.
- **Escape, the scrim and the close pill all shut it**, focus moves to the
  close pill on the way in and back to the tile on the way out, and the page
  behind is held still — through Lenis, which drives the scrolling here, since
  `overflow: hidden` alone would leave it running underneath.

The 24px is the same in both directions and stays that way while the page
moves, because the columns ride as whole blocks rather than tile by tile.

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

A pill is filled white, and the one for the page you are on stands down to a
tenth of it — the only pill that leads nowhere is the quiet one. Its label
turns over with it, black on a filled pill and white on the quiet one, since
black on a tenth of white would be all but unreadable. The pointer warms a
pill to the design's #efefe9, but never the page you are on: that rule sits
after the hover rule at the same weight, so hovering where you already are
leaves it as it is — and on a touch screen that pill is the button that opens
the stack.

Each pill is as wide as its own label and the 14px of padding either side —
nothing states a width. The design draws an index on the active pill, **01** or
**02**, and sets the three active widths by hand to hold it; both are dropped
here, so the page you are on is marked by colour alone and the pill never
changes size. Nothing is lost at rest: the design's own resting widths are the
labels' own. It draws 68, 107 and 127; the text measures 67.4, 106.7 and 126.4
at the design width.

The header is a strip running the full width between the 36px margins, so the
stack can sit on the centre line while the row still ends at the right. It is
inert — without that it would swallow clicks meant for the mosaic beneath it.

The pill you are on leads the stack wherever it falls in the list. Left in
place, the items above it would grow as the rest unfolded and push it down the
page, which is a jump the homepage never had because HOME is already first.

On about and contact the stack opens over the mark, which sits 120px down —
the place the design gives it under a navigation in the corner. Three pills
will not fit in the 84px above it, so the mark yields while the navigation is
open rather than being covered by it. It can only do that because the entrance
hands opacity back to CSS when it finishes: the fade is keyed to
`data-revealed`, so it cannot smear the arrival. Above the breakpoint only:
once the pages reflow the stack opens the band it stands in and pushes the
mark down rather than covering it, so there is nothing to yield to.

### Where there is nothing to hover with

Under `(max-width: 1199px), (hover: none)` the same stack opens on a tap of
the pill for the page you are on. Three things follow from that:

- **That pill becomes a button.** Left a link it would only lead back to the
  page already on screen, and the tap meant to open the stack would reload it.
  It carries `aria-expanded` and keeps `aria-current="page"`.
- **It closes as a menu should** — on Escape, on a pointer down anywhere
  outside it, and on the way to whichever page you pick.
- **Folded is the enhancement; open is the floor.** Nothing can set
  `data-open` without JavaScript and there is no hover to fall back on, so
  `html:not(.js)` leaves the stack open. That selector needs `:global` — in a
  CSS module a bare `.js` is hashed like any other local class, and the rule
  would match everywhere instead of nowhere.

The query is read in an effect rather than during render, so the server's
markup and the client's first pass agree and the form settles a frame later.

## Below the breakpoint

The composition is built at 1440 and zooms with `--s`. Below 1200px that
zoom would push type past readability, so `--s` returns to literal pixels and
the pages reflow: the mosaic into a 3 / 2 column masonry, the panel and the
identity band into full-width bands above it, the navigation into a single
centred row.

Four things that reflow depends on:

- **Tiles are placed from custom properties, not inline styles.** Each carries
  its design rect as `--x --y --w --h` and the stylesheet decides what to do
  with them: absolute coordinates on the desktop canvas, `inset: auto` and an
  `aspect-ratio` once they simply flow. Written as inline `left`/`top` they
  could not be overridden by a media query at all — the reflow rules were
  there long before they had any effect, and the mosaic ran 1440px wide inside
  a 390px screen.
- **The page is a column, and full height means what is left.** The header
  stops floating and takes its place in the flow below the breakpoint, so a
  screen asking for `100svh` overflows by exactly the header's height — enough
  to push "Reach out", anchored to the bottom edge, off the bottom of the
  screen. The page is a flex column instead and hands what remains to the
  routed content, which needs no figure for the header and cannot drift from
  it.
- **Targets clear 44px.** The pills are the only controls on the site, and
  below 480px they tighten across but never below the smallest size a finger
  can reliably hit.
- **The stack stays a stack, and opens on a tap.** See *Where there is
  nothing to hover with* above. It opens the band it stands in rather than
  covering the composition, so the page steps down while the menu is open and
  returns when it closes.
- **The bands hold more air.** The mark, the line and the grid below them are
  further apart than the desktop proportions would give at this width: 72px
  above the mark, 56px above the line, and 88px before the mosaic starts.

The viewport is `viewport-fit=cover`, so the black canvas runs under a phone's
cutout and `env(safe-area-inset-*)` reports real values — the header reads the
side insets and the pages anchored to the bottom edge read the bottom one.
Type that would otherwise be fixed at these widths is set with `clamp()`, and
`text-size-adjust` stops iOS inflating it in landscape.

## About

A long scroll, built from its own Figma frame
([node 2075:2](https://www.figma.com/design/MCws2TSRqHQPUcELEVfnRx/Untitled--Copy-?node-id=2075-2)),
1440 x 2267: a statement, two columns beneath it, what the studio does, who
leads the work, and an invitation at the foot.

It is placed rather than flowed, on the same `--s` scale as everything else,
because the design overlaps the CONTACT US pill and "Get in touch" at the
foot. Below the breakpoint they come apart and the page becomes a single
column, with the display type sized to the viewport rather than the frame.

The frame also sets the words "Creative Director" at 146px behind the
portrait; they are left out here.

Three things in it are worth knowing:

- **The disciplines are one run of type in two voices** — the sans in bone,
  the serif italic in grey — rather than five authored rows. A slash offers no
  line break of its own and a discipline holds together, so left alone the run
  is a single unbreakable word that overshoots its column by 500px. A `<wbr>`
  after each discipline is the only break the run allows, and with it the five
  lines fall exactly where the design sets them: greedy wrapping in 905px
  reproduces the frame's own composition.
- **"Get in touch" is outlined, not filled.** The design gives the text a
  transparent fill and lets its stroke carry it, which is `-webkit-text-stroke`
  here. The stroke scales with `--s` so it stays a hairline at any width.
- **The mark leads the page**, turning in the middle of it as it does
  everywhere else. The frame also hangs a second one in the top right corner,
  at an angle; it is left out here.

That corner is where `public/monogram.svg` was exported from, so the artwork
came out carrying the frame's -113.42° with it — which left the mark lying on
its side anywhere it is shown still, the stamps most of all. The file turns it
upright, M at the top and G at the foot.

The portrait is the one photograph on the site. Figma exports it at 2048px
square and 4MB; it is resized to 1500px and saved as a JPEG, since it has no
transparency, and served through `next/image` from there.

### The invitation carries a light

Move a pointer into the band at the foot of the page and the cursor is
replaced by the CONTACT US pill itself, which carries a light that fills in
the outlined "Get in touch" wherever it passes. `Torch` drives it.

The pill used to sit on the page and travel to meet the pointer, which left it
chasing the cursor it was supposed to be. It is the cursor now: drawn at the
pointer exactly, taking no clicks of its own, and gone the moment the pointer
leaves. The section itself is the link, so wherever the pointer is when it
decides, it lands on the same place — and the link reads as its own words
rather than as a bare target laid over the page.

- **Whether the pointer is inside is measured, not listened for.** The
  events come off `window` and the section is compared against the pointer's
  own coordinates, so nothing laid over the section can swallow a move and a
  cursor that was already inside before the page settled is noticed anyway.
  The same check runs on scroll: the section can arrive under a cursor that
  never moved, which fires no enter and no leave.
- **The section is its own ground**, starting below the portrait at 1860 —
  the portrait ends at 1822. Lit from anywhere on the page instead, the pill
  flies up out of the invitation and the borrowed cursor spills into the
  section above it, which is not what either is for.
- **It holds the pointer through a scroll.** The target is recomputed every
  frame from where the pill's own place has got to, so scrolling the page
  underneath a still cursor leaves the pill where the cursor is rather than
  carrying it along with the page.
- **A touch screen keeps the pill where the design puts it.** There is no
  cursor to replace, so the one at the foot of the page stands, and it is
  hidden only under `(min-width: 1200px) and (hover: hover)` — otherwise the
  invitation would have nothing to press.
- **The lit line is a second copy of the words**, filled rather than outlined
  and masked to a circle around the torch. A mask can reveal one layer over
  another, but it cannot fill in a stroke.
- **The band is a box around the words.** The section was `inset: 0` — the
  whole 2267px page — where a hover would have meant a hover on everything.

Desktop only, under `(min-width: 1200px) and (hover: hover)`: there is no
pointer to hand the pill to on a touch screen, and below the breakpoint the
foot of the page is a plain column with nothing to shine along.

### The disciplines answer to the pointer

The same arrangement as the invitation, with two differences: the pill reads
BOOK A CALL, and instead of a light there is a fill — the discipline under the
pointer goes to white while the rest hold their grey. The slash after it does
not: it is punctuation between two disciplines and belongs to neither.

That fill is plain CSS `:hover`, which needs the words themselves to be the
topmost thing under the pointer — so the whole run sits inside the link rather
than under a sheet laid across it. The section above it, which holds the
portrait, was `inset: 0` and therefore the topmost thing at every point below
it: the disciplines are higher up the page but earlier in the markup, so a
pointer over them was landing on that instead and nothing filled. It is a box
around its own three pieces now, 1308 to 1822.

Once the pages reflow the disciplines are a list to read rather than something
to press: no cursor to say where a word leads, so the link stops taking taps.

### Reading the portrait in blocks

Hovering it holds a pixelated frame of the same photograph over the original,
behind a window that follows the cursor. `PortraitReveal` drives it.

- **The window is cut to the picture's own grid.** It steps block by block
  rather than gliding, and its edges land on block edges — a window that
  sliced a block in half would give the whole thing away as an overlay. The
  grid was measured off the file rather than guessed: the blocks run 45px in
  a 960px square, starting 6px in, found by autocorrelating the mean
  column-to-column difference. The image carries enough grain that counting
  edges directly returns the noise instead.
- **Where the grid falls is read back at run time.** The frame is filled with
  `object-fit: cover`, so the picture is scaled to the longer side and the
  overflow cropped evenly; the component recomputes the cell size and the
  grid's origin from the live box, which is what keeps the window aligned at
  any width rather than only at 1440.
- **Two mask layers, no gradient stops**: a core five blocks square at full
  strength and a ring one block wider all round at 38%, which the default
  compositing adds together. Both counts are odd, so the two squares sit on
  the same grid, and the reveal falls away in whole blocks instead of
  feathering through them.
- **The pointer writes, CSS reads.** The block being pointed at goes onto the
  wrapper as `--gx`, `--gy` and `--cell`, and the mask on the layer inside
  reads them by inheritance. Nothing re-renders: a pointer reports far more
  often than React should be asked to draw, and a mask position is a paint
  rather than a layout. Writes are held to one a frame through
  `requestAnimationFrame`, with the first going straight through so the
  window is in place when it opens.
- **The defaults belong on the wrapper**, not on the layer that reads them: a
  `--gx` declared beside the mask shadows the one the pointer writes above it,
  and the window sits in the middle for ever.
- **There is nothing to follow on a touch screen**, so under `(hover: none)`
  the layer is not there at all and the portrait stands as it is.

## Contact

Built from its Figma frame
([node 2058:73](https://www.figma.com/design/MCws2TSRqHQPUcELEVfnRx/Untitled--Copy-?node-id=2058-73)),
on the same scale. It anchors rather than fixes its height: the mark and the
details centre themselves in what is left, and "Reach out" stays pinned to the
bottom edge at any window height.

### Stamping the page

Clicking either page anywhere that is not already doing something presses the
studio's mark onto the spot, leaning a little either way, as a stamp does.
`Stamps` holds them.

- **It listens on its own parent, and lays nothing over it.** A sheet across
  the page would take every pointer event the page beneath wants — the address
  on contact, the artwork on about. The layer the marks sit in takes none at
  all.
- **It knows what is not a click.** Anything with a job of its own — a link, a
  button, a field — keeps its click. So does a drag of more than 8px across
  the page, or a swipe down it, and so does the release at the end of
  selecting a line of the copy.
- **A mark lasts 2.6 seconds** — pressed on at 80% ink, held flat, then
  rolled off the page. The component clears it on the same 2.6 seconds, so
  the animation and the cleanup cannot drift apart.
- **It peels because it bends.** A mark is not one image but ten strips, each
  hinged on the foot of the one above it, so their turns accumulate down the
  sheet into a roll. They are nested rather than laid side by side: nesting is
  what accumulates the turns, where siblings would each have to be told the
  sum of every turn before it. The free end goes first and the roll travels up
  towards the anchored top, as peeling does — a single turn applied to all ten
  at once curves the sheet from both ends like something being rolled, not
  peeled.
- **Under the ink is the sheet it sits on**: a disc the size of the mark at 7%
  white, painted from the same background box as the artwork so every strip
  samples the same band of both. Flat it disappears inside the mark's own ring;
  rolling, it is what gives the curl a body, and where the roll doubles over
  itself the faces stack and the fold catches the light. Line art alone has
  nothing to bend.
- **Three animations, because they want three curves**: the press, the roll,
  and the ink. The ink holds until 80% so the roll happens while there is
  still something to see it by.
- **A dozen at once is a ceiling**, for anyone clicking faster than they fade.
  Each mark is twelve elements rather than one.

Two rules govern the whole thing, both easy to fall foul of: `preserve-3d` has
to be on every link in the chain, since one flat parent presses everything
below it into a picture; and an `opacity` below 1 flattens the element it is
set on, which is why the ink fades on the outer element and the roll lives
inside it.
- **They are placed as a share of the surface**, not in pixels, so they hold
  their spot if the window changes size while they are still there.

Under `prefers-reduced-motion` the mark is simply there rather than pressed on.

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

- **Parallax, by the column rather than by the tile.** Each column rides
  against the scroll as one block, so every gap inside it stays exactly what
  the grid set. It was a share of each tile's own height before, and since two
  tiles in a column are rarely the same height the same share came to
  different distances — the 24px between them stretched and closed as the page
  moved, which is the one measurement the whole grid is built on. The ride is
  a sine of the scroll position whose period divides the loop a whole number
  of times, so the offsets match on both sides of the seam and nothing shifts
  as the page wraps. Desktop only.
- **Tiles answer to a click, not a pointer.** They once scaled under the
  cursor while their neighbours receded; the artwork opens full size instead,
  and nothing moves on the way past. The cursor over a tile is `zoom-in`,
  which is the whole of the invitation.
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
  title: "ARTEMIS",        // shown under the tile
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

