# Christopher Buzaid, portfolio

My personal site. It shows how I make AI dependable inside a team (integration, evaluation, governance,
privacy) and backs each claim with a project page: what it is for, how it works, what I decided and why, and
what is still unfinished.

Stack: Vite, React 18, TypeScript (strict), react-router (HashRouter), Vitest. Design: Buzz & Ink v2, which is
white, true black, neutral greys, one orange and Geist.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test
npm run build    # type check, then the production bundle in dist/
npm run preview  # serve dist/
```

## Pages

| Page | Route | What it holds |
| --- | --- | --- |
| Home | `#/` | Positioning, a Now panel, the How I work ledger (four habits, each linked to proof), the work rows |
| Work | `#/work` | Every project with its status and one key figure |
| Case study | `#/work/:slug` | Brain, LearnAI, Buzz Off, Planno. Problem, how it works, evidence, decisions, where it stands |
| About | `#/about` | Experience, research, beyond the code |
| Not found | anything else | Links back to the work |

The portfolio guide (the Ask button in the header) answers questions from the site's public notes. It calls
`/api/digby` when `GEMINI_API_KEY` is set and falls back to saved replies when it is not.

## Layout

```
src/
  data/content.ts       all copy and project data
  data/hive.ts          public notes the guide retrieves from
  data/guide.ts         saved replies for the guide
  styles/site.css       tokens and every component style
  pages/                Home, Work, ProjectDetail, About, NotFound
  components/           Header, Ticker, Footer, WorkRows, Peek, Scramble, Guide, BrainDiagram, RecallResults, IconSprite
  context/              ThemeContext, GuideContext
  lib/digby.ts          retrieval, streaming client, card and action parser
api/                    the guide's serverless function (Vercel)
design/                 brief, page inventory and review notes for the 2026-11-02 rebuild
```

Working notes for agents are in `CLAUDE.md`.
