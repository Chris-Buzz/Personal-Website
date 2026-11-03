# Christopher Buzaid, portfolio

My personal site. I build my own AI products, plus websites and tools for small businesses and family who don't
have them. Each project has a page that shows what it is for, how it works, what I decided and why, and what is
still unfinished.

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
| Work | `#/work` (More work) | Smaller projects, work at IBM, and the skills and tools I built, with install commands |
| Case study | `#/work/:slug` | Common Memory, LearnAI, Buzz Off, Planno. Problem, how it works, evidence, decisions, where it stands |
| About | `#/about` | Experience, research, beyond the code |
| Map | `#/map` | Every note on the site as a 3D graph you can turn; the notes the guide looks up light up as it answers |
| Not found | anything else | Links back to the work |

The portfolio guide (the Ask button in the header) answers questions from the site's public notes. It calls
`/api/digby` when `GEMINI_API_KEY` is set and falls back to saved replies when it is not.

## Layout

```
src/
  data/content.ts       all copy and project data
  data/hive.ts          public notes the guide retrieves from
  data/guide.ts         saved replies for the guide
  data/siteMap.ts       the map's nodes and links, derived from content.ts and hive.ts
  data/agentFiles.ts    llms.txt, llms-full.txt and site.json, built from content.ts at build time
  map/orbitMap.ts       the map's renderer: light 3D on a 2D canvas
  styles/site.css       tokens and every component style
  pages/                Home, Work, ProjectDetail, About, MapPage, NotFound
  components/           Header, Ticker, Footer, WorkRows, MoreWork, Peek, Scramble, Guide, BrainDiagram, RecallResults, IconSprite
  context/              ThemeContext, GuideContext
  lib/digby.ts          retrieval, streaming client, card and action parser
api/                    the guide's serverless function (Vercel)
design/                 brief, page inventory and review notes for the 2026-11-02 rebuild
```

Working notes for agents are in `CLAUDE.md`.

## For AI agents

The build writes `/llms.txt` (a short map of the site), `/llms-full.txt` (every page's text) and `/site.json` (the
same facts as data), all generated from `src/data/content.ts`. The page head links to them and carries schema.org
data about me.

## Credits

The map's layout comes from [d3-force-3d](https://github.com/vasturiano/d3-force-3d) (MIT). The license of every
package the site ships is in `public/third-party-licenses.txt`.
