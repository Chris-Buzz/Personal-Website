# CLAUDE.md — working notes for Claude Code

This project was ported from a polished single-file HTML/CSS/JS prototype into a
structured React app. The **look and motion are the source of truth** — preserve
them. Below is everything you need to finish and polish it.

## Commands
- `npm install` then `npm run dev` (Vite, port 5173).
- `npm run build` runs `tsc -b && vite build`.
- There are no tests yet — adding Vitest + React Testing Library is a good early task.

## Mental model
- **Content is data.** `src/data/content.ts`, `hive.ts`, `buzzy.ts` hold everything.
  Pages map over data; don't hard-code copy into JSX.
- **One design system.** `src/styles/global.css` holds all tokens and component
  classes, ported 1:1 from the prototype. Components reference existing class names.
- **Two heavy interactive pieces** are isolated:
  - `three/HeroCinematic.tsx` — the WebGL tunnel. All Three.js lives in one
    `useEffect` that builds the scene, runs a single `requestAnimationFrame` loop
    driven by a 0..1 scroll value, and cleans up on unmount.
  - `graph/HiveCanvas.tsx` — the 2D force-directed graph on a `<canvas>`. Physics
    "sleeps" when settled; it reads nodes/edges from `data/hive.ts`.
- **Theme**: `ThemeContext` toggles `data-theme` on `<html>`. The canvases read the
  CSS variables live and also expose `window.__cineTheme` / `window.__hiveTheme`
  that the context calls on toggle (kept from the prototype — fine to refactor to
  props/events).
- **Buzzy**: `BuzzyContext` exposes `open`, `setOpen`, and `ask(query)`. Any
  component (Header, Footer, Work, the Hive node panel) calls `ask()` to pop the
  chat with a scripted answer from `data/buzzy.ts`.

## Polish backlog (roughly in priority order)
1. **Assets.** The portrait is hotlinked from `chrisbuzaid.dev` with a GitHub-avatar
   fallback. Drop real images into `src/assets/` and import them. Add OG/social
   images and a favicon.
2. **Performance budget.** Keep the home RAF cheap: no shadow maps, no PBR, no env
   maps (already removed). Cap `devicePixelRatio` at 1.5. Consider pausing the loop
   when the hero scrolls out of view (IntersectionObserver on `#cine-stick`).
3. **Accessibility.** Respect `prefers-reduced-motion` — short-circuit the cinematic
   to a static hero and disable the marquee animations. Add focus traps to the Buzzy
   panel, `aria-live` on new messages, and alt text on all images.
4. **Type safety.** `tsconfig` is intentionally lenient. Turn on `strict`,
   `noUnusedLocals`, `noUnusedParameters` and resolve the fallout (mostly the
   canvas code needs typed locals).
5. **CSS structure.** Optionally split `global.css` into CSS Modules per component,
   or adopt a tokens layer + utility classes. Not required, but if you do, keep the
   exact computed styles.
6. **Routing/SEO.** HashRouter is intentional for zero-config static hosting. If a
   real domain with a server is available, switch to BrowserRouter + per-route
   `<title>`/meta (react-helmet-async) and prerender.
7. **Buzzy → real RAG.** Replace the scripted matcher in `data/buzzy.ts` with a
   call to a small retrieval backend over the Hive nodes (embeddings + citations).
   The UI already renders a `sources:` line per message.
8. **Tests + CI.** Vitest for `data/buzzy.ts` reply matching and `data/hive.ts`
   edge integrity (every edge references a real node). Add a GitHub Action.

## Gotchas
- **Chris's explicit decision (July 2026): the cinematic must NOT end in a "Hive
  constellation" 3D graph.** One was built twice and removed twice — he hates it.
  The dive ends in the light-bloom and hands off to the intro section below.
  Do not re-add it, even though `hive.ts` feeds the Hive page and Digby.
- The home page sets `#cine-wrap { height: 340vh }`; the cinematic maps the page's
  scroll position within that tall wrapper to `p ∈ [0,1]`. Changing the height
  changes pacing.
- `body[data-route="hive"]` hides the footer and locks scroll — `App.tsx` sets
  `document.body.dataset.route` on navigation. Keep that in sync if you add routes.
- The hero hero-text (`#st-0`) is `opacity:1` by default in CSS so it shows on first
  paint even before the RAF loop runs (this fixed a blank-on-load bug). Don't remove.
- Icon set is an inline SVG `<symbol>` sprite rendered once by `IconSprite` at the
  app root; components reference symbols via `<use href="#i-arrow" />`.
