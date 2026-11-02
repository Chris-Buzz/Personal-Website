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
animations and transitions stop, the bee is hidden, the orange square shows at rest, the scramble does nothing, and
the theme switch skips its view transition.

| Element | Trigger | States | Duration | Easing |
| --- | --- | --- | --- | --- |
| Name lines (Home) | page load | below the mask, then in place; second line 0.08s later | 0.9s | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Bee (Home) | page load, after 0.25s | flies a five-point arc from upper left, shrinks onto the square, fades | 1.5s | `cubic-bezier(0.45, 0.05, 0.2, 1)` |
| Orange square after the name | page load, after 1.5s | scale 0.2, overshoot 1.25, rest at 1 | 0.52s | `cubic-bezier(0.16, 1, 0.3, 1)` |
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

Touch screens never show the row cards (`@media (hover: none)`), so nothing is lost without hover.

## Rules

- One accent, used in large fields (the Now panel, the square after the name) and in few small places.
- Status is shape plus word: filled for done or live, half for in progress, dashed for planned.
- Real assets only. Where a project has no real image, show its real numbers as type.
- More detail: `design/brief.md` (content rules), `design/review.md` (review outcomes), `PRODUCT.md`.
