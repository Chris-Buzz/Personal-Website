# Portfolio intake — fill this in, hand it back, I rebuild the site

This is pre-filled with everything I could pull from your repos + the current site, so you're
**editing and confirming, not writing from scratch.** Take your time.

**How to use:**
- `>> FILL IN:` = I don't have this, you write it.
- `>> CONFIRM:` = I think this is right, fix it if not.
- `[ ]` / `[x]` = check the box to decide.
- Anything you don't care about, leave blank — I'll use sensible defaults or skip it.

When you're done, just tell me "intake's ready" (or paste it back). I'll rebuild `src/data/content.ts`
and `src/data/hive.ts` from it in one pass. Don't worry about formatting — bullet points are fine.

---

## 1. You / About

- **Name:** Christopher Buzaid  `>> CONFIRM`
- **Tagline / headline:** currently *"I build AI that connects."*
  `>> CONFIRM or rewrite` — you said it leans too hard on AI. What's the fuller you in one line?
  (e.g. "CS student, full-stack builder, basketball leader" — your call)
- **Short bio (2–4 sentences, first or third person):**
  `>> FILL IN` (rough is fine — I'll polish. Draft from current site: "Computer Science at Monmouth,
  3.9 GPA. I ship AI products, write about how they work, and link every piece into one knowledge
  base you can talk to." — keep, edit, or replace.)

- **Education:** B.S. Computer Science, Monmouth University, GPA 3.9, Class of 2027  `>> CONFIRM`
- **Status / availability chip:** currently *"OPEN TO SUMMER 2026 INTERNSHIPS"*  `>> CONFIRM` (still true?)

- **Current job role(s) / experience** — the big gap. For each, give title · org · dates · 1 line:
  - `>> FILL IN:` role 1 (e.g. "Software Engineering Intern · Company · Summer 2025 · what you did")
  - `>> FILL IN:` role 2 (if any)
  - On the current site I only see: **Danfords** (hospitality) and a **basketball camp coach** role.
    `>> CONFIRM` keep these? Add real/current jobs above.

- **Passions / interests beyond AI** (3–5; powers the "broaden the framing" goal):
  - `>> FILL IN:` (e.g. basketball, music, design, gaming, fitness, cooking, …)

- **Leadership / life** (from current site — `>> CONFIRM` each, edit freely):
  - Club Basketball President — leading 50+ students
  - Practice Player — Women's team
  - Camp Coach — taught fundamentals to 50+ kids
  - Dean's List ×4

---

## 2. Contact / links

- **Email:** cjpbuzaid@gmail.com  `>> CONFIRM`
- **GitHub:** https://github.com/Chris-Buzz  `>> CONFIRM`
- **LinkedIn:** handle `christopher-buzaid`  `>> CONFIRM` (paste full URL if different)
- **Personal domain:** the site hotlinks photos from `chrisbuzaid.dev` — `>> CONFIRM` is that yours / live?
- **Anything else** (Twitter/X, itch.io, devpost, YouTube, etc.): `>> FILL IN`

---

## 3. Projects

For each project you want featured: **check the box**, give it a **rank** (1 = most important), and
fill **live URL** + **GitHub URL**. Descriptions/stacks below are pulled from your READMEs — edit if wrong.
Screenshots: drop image files in `src/assets/` later (or tell me a URL) — note "have screenshot" if you do.

### Strong candidates (I recommend featuring these)

**A. LearnAI**  `[ ] feature   rank: __`
- *What it is:* AI consulting & booking platform — book 1-on-1 sessions with AI consultants, browse an
  AI-projects showcase, plus the **Digby** browser extension for prompt enhancement across AI tools.  `>> CONFIRM/edit`
- *Stack:* React 18 · Vite · Tailwind · Framer Motion · FastAPI · Supabase (Postgres) · Chrome Extension (MV3) ·
  Microsoft/Google OAuth · Claude Sonnet 4.5 (AWS Bedrock) · Stripe · Vercel/Railway
- Live URL: `>> FILL IN`   ·   GitHub: `>> FILL IN`   ·   Screenshot? `>> FILL IN`

**B. Digby**  `[ ] feature   rank: __`
- *What it is:* A fully-local "AI second brain" — a markdown vault indexed into a self-building knowledge
  graph, RAG chat over it, and an **MCP** layer so any AI tool (Claude Desktop, Cursor) can read your vault.
  One Tauri desktop app, runs on-device.  `>> CONFIRM/edit`
- *Stack:* Tauri 2 · React 19 · TypeScript · Python 3.11 (FastAPI sidecar) · SQLite + sqlite-vec · Ollama
  (nomic-embed-text) · MCP
- `>> NOTE:` I found **three** Digby folders (`Digby`, `Digby-Personal`, `DigbyCampusLegacy`). Which is the
  canonical one to feature? `>> FILL IN`
- Live URL / demo: `>> FILL IN`   ·   GitHub: `>> FILL IN`   ·   Screenshot? `>> FILL IN`

**C. Planno**  `[ ] feature   rank: __`
- *What it is:* A planner that does the executive function for you — brain-dump in the morning, get a
  time-boxed day with big goals broken into small startable chapters and recharge protected. Responsive
  web app + Python API.  `>> CONFIRM/edit`
- *Stack:* React · Vite · FastAPI · Uvicorn · SQLite · Claude (server) or Ollama (local) · scrypt + HMAC sessions
- Live URL: `>> FILL IN` (site says it's deployed on Vercel)   ·   GitHub: `>> FILL IN`   ·   Screenshot? `>> FILL IN`

**D. CyberGame**  `[ ] feature   rank: __`
- *What it is:* Interactive cybersecurity training sim — spot phishing & social engineering in a realistic
  phone simulation. 50+ examples, scoring/levels, difficulty progression.  `>> CONFIRM/edit`
- *Stack:* Python Flask · SQLite · HTML/CSS/JS · REST API
- Live URL: `>> FILL IN`   ·   GitHub: `>> FILL IN`   ·   Screenshot? `>> FILL IN`

**E. Claudebot**  `[ ] feature   rank: __`
- *What it is:* A personal AI assistant Discord bot powered by Claude.  `>> CONFIRM/edit`
- *Stack:* TypeScript · discord.js · Anthropic SDK · better-sqlite3 · Playwright
- GitHub: `>> FILL IN`   ·   Screenshot? `>> FILL IN`

**F. genui-test (research)**  `[ ] feature   rank: __`
- *What it is:* A 6-framework "generative UI" evaluation (Vercel AI SDK, OpenUI, assistant-ui, LangGraph,
  CopilotKit, Crayon) with latency benchmarks, built on Ollama + IBM Carbon.  `>> CONFIRM/edit`
- GitHub: `>> FILL IN`   ·   Could be a "Thoughts" post instead of a project — `[ ] project   [ ] post`

### Others I found — keep, drop, or "maybe"?

Mark each: `[ ] feature   [ ] drop   [ ] maybe`
- **jersey-shore-dream-team** — Next.js 15 · Mapbox · GSAP. `>> FILL IN:` what is it? (README was boilerplate)
- **Buzzy the Llama** — Electron assistant app (the original "Buzzy"). The site currently features this as
  "Buzzy the AI." Keep, or replace with Digby/LearnAI? `>> FILL IN`
- **Movie app** — Flask + TMDb recommendations.
- **Max Overlay** — Flask, Census + FBI crime data viz for NJ towns.
- **Voice AI** — speech-to-text + Ollama chatbot.
- **Weather App** — city weather lookup.
- **Product Scraper** — currently featured on the site (Selenium). Keep or drop? `>> FILL IN`
- **Personal (probably skip):** Girlfriend Project / "Love App" (PWA), Mom App, Danny DeVito page, Mom/family apps.
  `>> CONFIRM` skip these from the public portfolio?

> Anything I missed or you want added that's NOT in the VS Code folder? `>> FILL IN`

---

## 4. Skills

I'll build the skills list (and the Hive graph nodes) from your real stacks. Cross out anything you
don't want shown, add anything missing. Draft grouped list:

- **Languages:** Python · TypeScript · JavaScript · SQL
- **Frontend:** React · Vite · Tailwind CSS · Framer Motion · Next.js · Three.js
- **Backend:** FastAPI · Flask · Node.js
- **Desktop / Extensions:** Tauri · Electron · Chrome Extensions (MV3)
- **Data / DB:** Supabase (Postgres) · SQLite · sqlite-vec
- **AI / ML:** LLMs · RAG · Embeddings · Knowledge Graphs · MCP · Ollama · Claude / Anthropic SDK ·
  AWS Bedrock · Gemini · Prompt engineering
- **DevOps / Tools:** Git · Vercel · Railway · Stripe · OAuth (Google/Microsoft) · Turborepo/pnpm

`>> CONFIRM / edit the list above.`  Anything you're learning now and want to show as "in progress"? `>> FILL IN`

---

## 5. Thoughts / writing (optional)

The site has a "Thoughts" section with placeholder posts. Options:
- `[ ]` Leave placeholders for now (fastest)
- `[ ]` I'll write real posts later — just list titles you'd want: `>> FILL IN`
- `[ ]` Turn build logs / READMEs (LearnAI, Digby, genui-test eval) into real posts — point me at them

---

## 6. Resume — deferred (your call)

You said you'll update your old one. When ready: hand me the updated resume (PDF or just the bullet
points) and I'll wire up a download button + a `/resume` page. Nothing needed here for now.

---

## 7. Framing / vibe — anything else?

- Keep the current honey/orange + cinematic-tunnel look? `>> CONFIRM` (I assume yes)
- Anything you want the site to say about you that the projects alone don't? `>> FILL IN`
- A line for the homepage "through-line" (currently "Four bets. One thread.")? `>> CONFIRM/edit`
