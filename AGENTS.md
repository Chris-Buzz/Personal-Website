# AGENTS.md, working notes for agents (same as CLAUDE.md)

Christopher Buzaid's portfolio: a static React + Vite site with a page per project and a small chat guide.
Rebuilt on 2026-11-02 (branch `finish-portfolio`) in Buzz & Ink v2: white, true black, neutral greys, one
orange (#FF6A00), Geist and Geist Mono. Read `DESIGN.md` first (the brief and every interaction with its timing);
more design notes are in `design/` (content rules, page inventory, review findings). Chris is not job hunting, so
copy speaks to people who want something built, not to recruiters.

## Commands

- `npm install`, then `npm run dev` (Vite, port 5173).
- `npm run build` runs `tsc -b && vite build`. TypeScript is strict.
- `npm test` runs Vitest (guide replies, retrieval, data integrity).
- There is no ESLint setup. `npm run lint` refers to an ESLint that is not installed.

## How it is put together

- **Content is data.** Every word of copy lives in `src/data/content.ts` (projects, the How I work ledger,
  experience, the Common Memory recall numbers, the More work list). Pages map over it. Add a fact only with a
  source.
- **One stylesheet.** `src/styles/site.css` holds the tokens (light in `:root`, dark in `[data-theme='dark']`)
  and every component class. No CSS modules, no utility framework.
- **Pages:** `Home`, `Work` (the four case studies, then `MoreWork`: smaller projects, work at IBM, and the
  skills and tools Chris built, with install blocks), `ProjectDetail` (one template for `/work/:slug`, with an
  optional picture gallery), `About`, `MapPage` (`/map`), `NotFound`. `BrainDiagram` and `RecallResults` render
  only on the Common Memory page (slug `common-memory`; the vault itself is called Brain, which never appears on
  the site).
- **Map (`/map`):** the page is only the map. `src/data/siteMap.ts` derives every node from `content.ts` and
  `hive.ts`, nothing from the vault. `src/map/orbitMap.ts` draws it as light 3D on a 2D canvas (layout by
  d3-force-3d, a small perspective projection, no WebGL), lazy-loaded with the page. It draws only when something
  changes, plus a drift capped at 30 frames a second while on screen. When a visitor asks the guide,
  `GuideContext.recall` carries the labels `retrieve` picked and the map fires them, so every hive label must stay
  a node id (a test checks it).
- **For AI agents:** `src/data/agentFiles.ts` builds `/llms.txt`, `/llms-full.txt` and `/site.json` from
  `content.ts`, and the `agentFilesPlugin` in `vite.config.ts` serves them in dev, writes them into `dist/`, and
  adds schema.org Person data and `rel="alternate"` links to the page head. `public/robots.txt` welcomes all
  agents. Never hand-edit the generated files.
- **Installable skills:** `SKILLS` in `content.ts` names the plugin repo (`Chris-Buzz/claude-skills`, marketplace
  `chris-buzz`). Its `published` flag stays false until that repo is public on GitHub; while false, the site and the
  agent files hide the plugin install commands. Public repos (Buzz & Ink) always show clone and ZIP.
- **Personality, from heyhaigh.ai and the approved "Portfolio, simple" design:** the floating pill nav
  (`Header`), the news bar (`Ticker`, content in `NEWS`, hides itself from `NEWS.until`), mono labels that
  scramble on hover (`Scramble`), the bee that lands as the period after the name (Home), and two evidence cards
  that fan out of each work row on hover (`Peek`, built from real project data, never mock screenshots).
- **Routing:** HashRouter on purpose, so the site needs no host configuration. `/hive`, `/thoughts` and
  `/work/digby` redirect.
- **Guide:** `GuideContext` exposes `ask(query)`. `lib/digby.ts` retrieves from the public notes in
  `data/hive.ts` and streams from `/api/digby` (Gemini, key in `GEMINI_API_KEY`, never in the repo). When the
  API is unavailable, `data/guide.ts` answers from saved replies.
- **Theme:** `ThemeContext` sets `data-theme` on `<html>`; `index.html` applies the saved theme before first
  paint.

## Content rules

- GTS appears only as "AI Research Intern, January to May 2026". Never describe that work or the current
  part-time role.
- Never claim Overlook Golf Center as a client or a project, LearnAI payments or its browser extension, or
  anything a repo README promises but the product does not do.
- Common Memory has no public repo by choice. Never show vault contents, chat excerpts or personal data, and never
  call it Brain on the site (a test checks every page's data and the agent files).
- Copy follows Chris's voice: no em dashes or semicolons, numbers over adjectives, a reason with every decision.

## Gotchas

- Content must never depend on a JavaScript reveal. The animations are the name reveal, the bee, a short route
  fade, the scramble and hover states, and all of them switch off under reduced motion.
- Update `NEWS` in `content.ts` when there is new news; an expired item simply disappears.
- A hidden or background browser tab pauses CSS animations, so screenshots can catch a half-faded page.
  Finish animations (`document.getAnimations().forEach(a => a.finish())`) before capturing.
- `npm install` fails with ERESOLVE because `@vitejs/plugin-react` 4.x declares support only up to Vite 7 while
  the repo runs Vite 8. Use `npm install --legacy-peer-deps` until plugin-react moves to 6.x (supports Vite 8).
- `public/third-party-licenses.txt` holds the license of every production dependency, because the minified bundle
  drops their notices. Regenerate it after adding or upgrading a dependency.
- The map's frame loop stops when nothing moves, and the drift waits for 4 seconds without input and for the map
  to be on screen, so an idle page costs almost nothing. Reduced motion turns the drift, lean and twinkle off.
- `src/map/d3-force-3d.d.ts` types only the parts of d3-force-3d the map uses; the package ships no types.
