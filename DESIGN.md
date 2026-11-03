# Design

## Brief

The site is for small-business owners, family and friends who need a website or a tool built, and for people curious
about the products Chris builds himself (he is not job hunting; his post-graduation plans are settled). The mood is
an engineering tool with a friendly face: "super clean, modern and friendly", where "simplicity is excellence" and
every bit of play answers something the visitor did. The palette is Buzz & Ink v2: a white ground, true black ink
(#0A0A0A), neutral greys, one vivid orange (#FF6A00) spent in a few large fields, and Geist with Geist Mono. The
reference is heyhaigh.ai: a floating pill nav, mono labels, a news bar, and project rows that come alive on hover.
No childish or painterly 3D. Complexity belongs in choreography, never in cartoon rendering.

## Interactions

Every motion below is in `src/styles/site.css` or the named component. Under `prefers-reduced-motion: reduce`, all
animations and transitions stop, the bee is hidden and never visits, the orange square shows at rest, the scramble does nothing, and
the theme switch skips its view transition.

| Element | Trigger | States | Duration | Easing |
| --- | --- | --- | --- | --- |
| Name lines (Home) | page load | below the mask, then in place; second line 0.08s later | 0.9s | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Bee (Home) | page load, after 0.25s | flies a five-point arc from upper left, shrinks onto the square, fades | 1.5s | `cubic-bezier(0.45, 0.05, 0.2, 1)` |
| Orange square after the name | page load, after 1.5s | scale 0.2, overshoot 1.25, rest at 1 | 0.52s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Bee visit (Home, `BeeVisit`) | from 2.1s after load: mouse or pen over, or keyboard focus on, a hero button or Now link | square shrinks to 0; bee flies a curve to the item's top-right corner and sits still, ink on the orange panel; 0.8s after the pointer or focus leaves the hero it flies home and the square pops back | lift-off 0.16s; flight 0.55s from home, 0.4s between items, 0.6s home; pop 0.52s | lift-off `ease-in`; flights `cubic-bezier(0.45, 0.05, 0.2, 1)`; pop `cubic-bezier(0.16, 1, 0.3, 1)` |
| Page content | route change | opacity 0 and 6px down, then in place | 0.32s | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| News bar text (`Ticker`) | page load | random glyphs resolve left to right | 0.9s | linear, per frame |
| Nav and guide labels (`Scramble`) | hover | random glyphs resolve left to right | 0.52s | linear, per frame |
| Nav icons (`Header`) | hover | grid turns 90deg, person nods, chat bubble tips 12deg, sun turns, moon rocks, mail lifts 2px, bee tilts 14deg | 0.4s | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Pill items, buttons, links, rows | hover | background, border or colour change | 0.16 to 0.18s | `ease` |
| Arrows in buttons, rows and proofs | hover | move 3 to 8px right | 0.2 to 0.24s | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Work row cards (`Peek`) | hover or keyboard focus on the row | two cards rise from 18px down and 0.9 scale, fan to -6deg and 5deg; the row's figure fades out; second card 0.05s later | 0.42s (opacity 0.22s) | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Brain diagram stage and walkthrough step | hover or tap | matching stage and step highlight together | 0.16s | `ease` |
| Guide panel | Ask button, Escape, click outside, Close | hidden, then visible and 6px up into place | 0.2s | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Guide typing dots | waiting for an answer | three dots fade in turn while a reply is pending | 1s per cycle | `ease-in-out` |
| Theme switch | toggle | whole palette swaps at once through a view transition | browser default | browser default |
| Map arrival (`/map`, `src/map/orbitMap.ts`) | page open | the 3D layout is worked out before the first frame, so the graph appears in place, turned a little, framed in the space left of the legend | none | none |
| Map lean | mouse over the map | the graph turns a few degrees toward the pointer | eases in about 0.3s | exponential, per frame |
| Map turn, pan and zoom | drag turns it; Shift-drag or two fingers pan; Ctrl or Cmd with the wheel, a pinch, or the + and - buttons zoom | the graph follows the pointer; buttons, Fit and Center ease | buttons 0.45s | ease-out cubic |
| Map drift | 4s without input, map on screen | the graph turns slowly on its own, at most 30 frames a second | about 3deg a second | linear |
| Map node hover | pointer over a node | it and its neighbours stay lit and labelled, their links brighten, the rest dim to 15% | next frame | none |
| Map node click | click or tap | its card opens on the left (a sheet from the bottom on a phone); double-click or Ctrl-click opens its page | card 0.2s | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Map legend, search and list | press a group, type, or press List | that group or the matching notes stay lit and labelled; List opens every note as links on the left | next frame | none |
| Map recall firing | a question to the guide | the notes it looked up flare warm white one after another, 0.15s apart, with a bright link from the previous note when they are linked and a ring that spreads once | ring 0.6s; flare holds 1.1s, then fades over 1.1s | ring ease-out cubic; fade linear |
| Map slide | guide opens or closes, a card or the list opens, the legend folds, resize | the graph eases into the open space between the panels | about 0.3s | exponential, per frame |
| Map nav icon | hover | three linked nodes turn -20deg | 0.4s | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

Touch screens never show the row cards (`@media (hover: none)`) or the bee's visits (taps are ignored), so nothing is
lost without hover.

The map page is only the map: deep space in both themes (a near-black sky, a faint orange glow and a cooler haze,
two layers of CSS stars, the brighter one twinkling), and the graph in the site's own palette. Projects are orange,
skills a lighter peach, and the rest white or grey, told apart by shape: circle, ring, diamond, triangle, square.
Nodes glow and links take the colour of the node they lead to, both drawn with additive blending. A cloud of faint
stars turns with the graph for depth. It is a 2D canvas with no WebGL, drawn only when something changes plus the
capped drift. Under reduced motion there is no drift, lean, twinkle or ring, the view jumps instead of easing, and a
note the guide read stays lit for 1.3s without fading. Every node is also a link in the List panel.

## Rules

- One accent, used in large fields (the Now panel, the square after the name) and in few small places.
- Status is shape plus word: filled for done or live, half for in progress, dashed for planned.
- Real assets only. Where a project has no real image, show its real numbers as type.
- More detail: `design/brief.md` (content rules), `design/review.md` (review outcomes), `PRODUCT.md`.
