# CLAUDE.md, working notes for agents

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
  experience, the Brain recall numbers). Pages map over it. Add a fact only with a source.
- **One stylesheet.** `src/styles/site.css` holds the tokens (light in `:root`, dark in `[data-theme='dark']`)
  and every component class. No CSS modules, no utility framework.
- **Pages:** `Home`, `Work`, `ProjectDetail` (one template for `/work/:slug`), `About`, `NotFound`.
  `BrainDiagram` and `RecallResults` render only on the Brain page.
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
- Brain has no public repo by choice. Never show vault contents, chat excerpts or personal data.
- Copy follows Chris's voice: no em dashes or semicolons, numbers over adjectives, a reason with every decision.

## Gotchas

- Content must never depend on a JavaScript reveal. The animations are the name reveal, the bee, a short route
  fade, the scramble and hover states, and all of them switch off under reduced motion.
- Update `NEWS` in `content.ts` when there is new news; an expired item simply disappears.
- A hidden or background browser tab pauses CSS animations, so screenshots can catch a half-faded page.
  Finish animations (`document.getAnimations().forEach(a => a.finish())`) before capturing.
- `three` and `@types/three` are still in package.json but unused; `npm uninstall` hit a peer-dependency
  conflict on 2026-11-02 and was left alone.
