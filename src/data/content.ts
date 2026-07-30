// All page copy lives here so pages stay thin and data-driven.

export const PROFILE = {
  name: 'Christopher Buzaid',
  email: 'cjpbuzaid@gmail.com',
  github: 'https://github.com/Chris-Buzz',
  githubHandle: 'Chris-Buzz',
  linkedin: 'https://linkedin.com/in/christopher-buzaid',
  linkedinHandle: 'christopher-buzaid',
  // TODO(assets): replace with a local import from src/assets/.
  photo: 'https://chrisbuzaid.dev/public/images/profile.jpg',
  photoFallback: 'https://github.com/Chris-Buzz.png',
  status: 'Open to internships',
  availabilityChip: 'OPEN TO SUMMER 2026 INTERNSHIPS',
};

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/hive', label: 'The Hive' },
  { to: '/thoughts', label: 'Thoughts' },
  { to: '/about', label: 'About' },
];

export const NEXT_CARDS = [
  { to: '/work', num: '01 — WORK', title: "Eight things I've built", body: 'Planno, LearnAI, Digby, CyberGame and more — each one opens into the full story.', go: 'Browse projects' },
  { to: '/hive', num: '02 — THE HIVE', title: 'My brain, as a graph', body: 'Every project, post, and skill as one living graph — the same one Digby reads.', go: 'Enter the Hive' },
  { to: '/thoughts', num: '03 — THOUGHTS', title: 'Notes from the build', body: 'Notes on AI, RAG, and what the court taught me about shipping.', go: 'Read the writing' },
  { to: '/about', num: '04 — ABOUT', title: 'The story behind it', body: 'Four chapters, one university, fifty teammates, and a 3.9.', go: 'Read the story' },
];

// Home opener — the identity moment right after the tunnel lands.
// NOTE(intake): voice pass pending — refine wording via PORTFOLIO-INTAKE.md.
export const INTRO = {
  kicker: 'More about me',
  h: 'I like big projects',
  hEm: 'and good teammates.',
  sub: "The short version: I pick projects slightly too big for me, figure them out, and try to be the kind of teammate people want around while I do it. Everything on this site is real and shipped — and Digby can answer questions about any of it.",
  chips: [
    { k: 'School', v: "Monmouth CS '27" },
    { k: 'GPA', v: '3.9 / 4.0' },
    { k: 'Leads', v: '50+ club athletes' },
    { k: 'Status', v: 'Open — Summer 2026 internships' },
  ],
  photoCaption: 'LAKE GROVE, NY · MONMOUTH U',
};

// Home story band ("Four bets. One thread.")
export const STORY_BEATS = [
  { n: '01', k: 'The Spark', h: 'It started with one program that worked', p: "The first program I wrote actually ran, and that was it — I was in. Now it's CS at Monmouth with a 3.9 and four straight semesters of Dean's List." },
  { n: '02', k: 'The Build', h: "Then I couldn't stop building", p: 'Planno gets opened most mornings. LearnAI took real bookings and payments. Digby reads my notes back to me. Every build taught the next one.' },
  { n: '03', k: 'The Court', h: 'Basketball taught me the people part', p: "I run a 50-person basketball club and practice against the Women's team so they get better, not me. Turns out that's most of what leading is." },
  { n: '04', k: 'The Hive', h: 'Now it all lives in one place', p: 'Everything I build lands in one graph — the Hive — and Digby answers questions from it, with receipts. Poke around. Ask him things.' },
];

export type ShotKind = 'planno' | 'buzzy' | 'scraper' | 'graph' | 'learnai' | 'digby' | 'cyber' | 'claudebot';

export interface Project {
  num: string;
  /** anchor id — /work?p=<slug> scrolls to this project */
  slug: string;
  badge: string;
  badgeLive?: boolean;
  date: string;
  title: string;
  desc: string;
  tags: string[];
  links: { label: string; href?: string; icon: 'ext' | 'github' | 'arrow' | 'doc'; ask?: string; muted?: boolean }[];
  shot: ShotKind;
}

// NOTE: dates for LearnAI/Digby are approximate (from repo activity) — confirm
// via PORTFOLIO-INTAKE.md, along with live URLs and per-repo GitHub links.
export const PROJECTS: Project[] = [
  {
    num: '01', slug: 'learnai', badge: 'Live', badgeLive: true, date: '2025 — PRESENT', title: 'LearnAI',
    desc: 'A full AI consulting platform: book 1-on-1 sessions, browse the project showcase, pay through Stripe, sign in with Google or Microsoft. Ships with a Chrome extension that upgrades your prompts on any AI site. React front, FastAPI back, Supabase under it all.',
    tags: ['React', 'FastAPI', 'Supabase', 'Stripe', 'Claude', 'Chrome Extension'],
    links: [
      { label: 'Live — lainow.com', href: 'https://www.lainow.com', icon: 'ext' },
      { label: 'Ask Digby about it', icon: 'arrow', ask: 'What is LearnAI?', muted: true },
    ],
    shot: 'learnai',
  },
  {
    num: '02', slug: 'digby', badge: 'Flagship', date: '2026 — PRESENT', title: 'Digby',
    desc: "A local-first AI second brain. Your notes live as markdown on disk; Digby indexes them into a knowledge graph that builds itself, answers questions over it with citations, and exposes it all over MCP so Claude Desktop or Cursor can read your vault too. One Tauri desktop app, fully on-device. He's also the assistant on this site.",
    tags: ['Tauri', 'React', 'FastAPI', 'SQLite', 'Ollama', 'MCP', 'RAG'],
    links: [
      { label: 'Source', href: 'https://github.com/Chris-Buzz', icon: 'github' },
      { label: 'Talk to Digby', icon: 'arrow', ask: 'Tell me about Digby', muted: true },
    ],
    shot: 'digby',
  },
  {
    num: '03', slug: 'planno', badge: 'Live', badgeLive: true, date: 'OCT 2024 — PRESENT', title: 'Planno',
    desc: "A planner that does the executive function for you. Brain-dump your morning; Planno hands back a time-boxed day with the big goals broken into small, startable pieces. Deployed, and actually opened most mornings — which is the metric that matters.",
    tags: ['React', 'FastAPI', 'SQLite', 'Claude', 'Ollama'],
    links: [
      { label: 'Live demo', href: 'https://planno-eta.vercel.app/', icon: 'ext' },
      { label: 'Source', href: 'https://github.com/Chris-Buzz', icon: 'github', muted: true },
    ],
    shot: 'planno',
  },
  {
    num: '04', slug: 'cybergame', badge: 'Complete', date: 'DEC 2025', title: 'CyberGame',
    desc: 'A cybersecurity training sim: a fake phone screen feeds you texts, emails, and calls, and you decide what\'s phishing and what\'s real. 50+ scenarios, scoring, levels that get meaner as you improve. Built to make security training something people actually finish.',
    tags: ['Flask', 'Python', 'SQLite', 'REST API'],
    links: [
      { label: 'Source', href: 'https://github.com/Chris-Buzz', icon: 'github' },
    ],
    shot: 'cyber',
  },
  {
    num: '05', slug: 'claudebot', badge: 'Running', date: 'FEB 2026 — PRESENT', title: 'Claudebot',
    desc: 'A personal Discord assistant on the Anthropic SDK — answers in my servers, remembers with SQLite, and can drive a browser through Playwright when a question needs the live web.',
    tags: ['TypeScript', 'discord.js', 'Claude', 'SQLite', 'Playwright'],
    links: [
      { label: 'Source', href: 'https://github.com/Chris-Buzz', icon: 'github' },
    ],
    shot: 'claudebot',
  },
  {
    num: '06', slug: 'buzzy-the-ai', badge: 'Origin story', date: 'JAN 2025', title: 'Buzzy the AI',
    desc: 'Where Digby started: an offline desktop assistant on Ollama and Llama 3, with profiles and custom personalities. Everything I learned building Buzzy — local models, memory, personality — fed straight into Digby.',
    tags: ['Python', 'Electron', 'Ollama', 'Llama 3'],
    links: [
      { label: 'Source', href: 'https://github.com/Chris-Buzz', icon: 'github' },
    ],
    shot: 'buzzy',
  },
  {
    num: '07', slug: 'product-scraper', badge: 'Automation', date: 'APR 2025', title: 'Product Scraper',
    desc: 'Selenium automation that runs product searches, ranks by rating and price, and hands back a shortlist. Browser automation that survives the real, messy web — retries, waits, and all.',
    tags: ['Python', 'Selenium', 'Headless Chrome'],
    links: [{ label: 'Source', href: 'https://github.com/Chris-Buzz', icon: 'github' }],
    shot: 'scraper',
  },
  {
    num: '08', slug: 'this-portfolio', badge: 'In progress', date: '2026 —', title: 'This Portfolio',
    desc: 'The site you\'re on. A scroll-driven 3D dive, the full interactive Hive, and Digby answering questions with sources — all in a system I call Honey & Ink.',
    tags: ['React', 'Three.js', 'Canvas', 'RAG', 'Gemini'],
    links: [
      { label: 'Enter the Hive', href: '#/hive', icon: 'arrow' },
      { label: 'Read the build log', href: '#/thoughts', icon: 'doc', muted: true },
    ],
    shot: 'graph',
  },
];

/* ── Case studies — one per project slug, drives /work/<slug> ─────────────
   NOTE(intake): dates, live URLs, and per-repo GitHub links still need
   confirming via PORTFOLIO-INTAKE.md. Copy below sticks to what the repos
   themselves document — no invented metrics.                              */

export interface CaseStudy {
  /** one-line hook under the title */
  tagline: string;
  /** overview paragraphs */
  overview: string[];
  /** feature cards */
  highlights: { h: string; p: string }[];
  /** narrative beats (kicker / heading / paragraph) */
  story: { k: string; h: string; p: string }[];
  /** stack rows for the side rail */
  stack: { k: string; v: string }[];
  /** at-a-glance rows for the side rail */
  facts: { k: string; v: string }[];
  /** prompt for the "Ask Digby" button */
  ask: string;
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  learnai: {
    tagline: 'A full AI consulting platform — bookings, payments, a project showcase, and a prompt-upgrading Chrome extension, running on a real production stack.',
    overview: [
      'LearnAI is the biggest thing I\'ve shipped: a platform where people book 1-on-1 AI consulting sessions, browse a showcase of working AI projects, and pay — actually pay — through Stripe. Sign-in runs through Google or Microsoft OAuth, data lives in Supabase, and a FastAPI backend holds it together.',
      'It also ships a Chrome extension that rewrites your prompts on any AI site before you hit enter, powered by Claude on AWS Bedrock. The platform and the extension share one account system, so the product works wherever you already are.',
    ],
    highlights: [
      { h: 'Bookings and payments, end to end', p: 'Session scheduling with Stripe checkout all the way through — the unglamorous parts (auth, payments, state) are the parts that work.' },
      { h: 'Chrome extension (MV3)', p: 'A prompt enhancer that runs on claude.ai, ChatGPT, and friends — one click and your prompt comes back sharper.' },
      { h: 'Real OAuth sign-in', p: 'Google and Microsoft OAuth flows into Supabase — the kind of plumbing tutorials skip.' },
      { h: 'Claude via AWS Bedrock', p: 'Model calls run server-side through Bedrock, keeping keys off the client and usage under control.' },
    ],
    story: [
      { k: 'Why I built it', h: 'Everyone asked the same questions', p: 'People kept asking how to actually use AI — not the hype, the practice. A booking platform for 1-on-1 sessions turned those conversations into a product.' },
      { k: 'How it went', h: 'The stack got serious', p: 'This is where the toy-project stack stopped being enough: OAuth instead of fake logins, Stripe instead of a "contact me" form, Supabase migrations instead of a JSON file. Every piece had to survive a stranger using it.' },
      { k: 'What I learned', h: 'Auth and payments come first now', p: 'The lesson LearnAI beat into me: features demo well, but auth, payments, and error states are the product. I build those first now.' },
    ],
    stack: [
      { k: 'Frontend', v: 'React · Vite · Tailwind · Framer Motion' },
      { k: 'Backend', v: 'FastAPI · Supabase (Postgres)' },
      { k: 'AI', v: 'Claude on AWS Bedrock' },
      { k: 'Payments / Auth', v: 'Stripe · Google + Microsoft OAuth' },
      { k: 'Extension', v: 'Chrome Manifest V3' },
    ],
    facts: [
      { k: 'Role', v: 'Solo — design to deploy' },
      { k: 'Timeline', v: '2025 — present' },
      { k: 'Status', v: 'Flagship, in development' },
      { k: 'Type', v: 'Full-stack SaaS' },
    ],
    ask: 'Walk me through how LearnAI works.',
  },

  digby: {
    tagline: 'A local-first AI second brain: your notes become a knowledge graph that builds itself, answers with citations, and serves any AI tool over MCP.',
    overview: [
      'Digby is my answer to a simple discomfort: I don\'t want my second brain living on someone else\'s server. Your notes stay as markdown on your own disk; Digby indexes them into a knowledge graph that builds itself, runs retrieval over it, and answers questions with citations back to the exact files.',
      'The part I\'m proudest of is the MCP layer — Digby exposes your vault as a Model Context Protocol server, so Claude Desktop, Cursor, or any MCP client can read your knowledge base too. One Tauri desktop app, embeddings through Ollama, everything on-device. He\'s also the assistant on this site — the chat in the corner is Digby\'s cloud twin.',
    ],
    highlights: [
      { h: 'Fully on-device', p: 'Markdown vault, SQLite + sqlite-vec index, Ollama embeddings — nothing leaves your machine.' },
      { h: 'Self-building graph', p: 'Notes get parsed, linked, and embedded automatically; the graph grows as you write.' },
      { h: 'Answers with receipts', p: 'RAG over your own vault, with citations to the exact notes — no confident guessing.' },
      { h: 'MCP server built in', p: 'Claude Desktop or Cursor can query your vault directly. Your notes become infrastructure.' },
    ],
    story: [
      { k: 'Why I built it', h: 'Buzzy deserved a bigger brain', p: 'Buzzy — my first offline assistant — could talk, but he couldn\'t really know things. The fix wasn\'t a bigger model; it was giving a small model a real memory: my own notes, indexed properly.' },
      { k: 'How it went', h: 'Three runtimes, one app', p: 'Tauri wraps a React front end and a Python FastAPI sidecar into one desktop app. Getting Rust, Node, and Python to behave as a single install was its own education.' },
      { k: 'What I learned', h: 'Keeping it local made everything simpler', p: 'Privacy isn\'t a checkbox — it\'s an architecture. Deciding "nothing leaves the machine" up front made every later decision simpler and the product more honest.' },
    ],
    stack: [
      { k: 'Desktop', v: 'Tauri 2 · React 19 · TypeScript' },
      { k: 'Engine', v: 'Python 3.11 · FastAPI sidecar' },
      { k: 'Index', v: 'SQLite · sqlite-vec' },
      { k: 'AI', v: 'Ollama (nomic-embed-text) · RAG' },
      { k: 'Interop', v: 'MCP (Model Context Protocol)' },
    ],
    facts: [
      { k: 'Role', v: 'Solo — architecture to UI' },
      { k: 'Timeline', v: '2026 — present' },
      { k: 'Status', v: 'Flagship, in development' },
      { k: 'Type', v: 'Desktop app · AI infra' },
    ],
    ask: 'Tell me about Digby — the desktop app, not just you.',
  },

  planno: {
    tagline: 'A planner that does the executive function for you: brain-dump your morning, get back a time-boxed day you can actually start.',
    overview: [
      'Planno exists because the hardest part of a productive day is the first ten minutes of deciding. You dump everything on your mind into one box; Planno hands back a time-boxed day with the big goals broken into small, startable pieces — and recharge time protected instead of treated as leftover.',
      'It\'s deployed and it\'s the project I actually live in: opened most mornings, which is the only planner metric that matters. The AI runs through Claude on the server, or Ollama when I want it fully local.',
    ],
    highlights: [
      { h: 'Starts with a brain-dump', p: 'Free-text morning dump becomes a structured, time-boxed day — no forms, no dragging blocks around.' },
      { h: 'Startable pieces', p: 'Big goals get broken into chapters small enough that starting stops being the hard part.' },
      { h: 'Recharge is protected', p: 'Rest gets scheduled like work, because a plan that burns you out by Wednesday isn\'t a plan.' },
      { h: 'Hand-rolled auth', p: 'scrypt hashing and HMAC-signed sessions, written from scratch — built to understand it, not just install it.' },
    ],
    story: [
      { k: 'Why I built it', h: 'Planners assume you\'ve already decided', p: 'Every planner app wants you to arrive with tasks pre-sorted. The actual problem is upstream: turning a foggy morning into a first step. That\'s a language problem, which makes it an LLM problem.' },
      { k: 'How it went', h: 'Ten months of dogfooding', p: 'Using it every morning meant every rough edge got felt personally. Features that sounded clever but didn\'t survive a real Tuesday got cut.' },
      { k: 'What I learned', h: 'It has to be worth opening tomorrow', p: 'Planno taught me to optimize for "opened again tomorrow" over "impressive in a demo." Retention is the honest benchmark, even with one user.' },
    ],
    stack: [
      { k: 'Frontend', v: 'React · Vite' },
      { k: 'Backend', v: 'FastAPI · Uvicorn · SQLite' },
      { k: 'AI', v: 'Claude (server) · Ollama (local)' },
      { k: 'Auth', v: 'scrypt + HMAC sessions' },
      { k: 'Deploy', v: 'Vercel' },
    ],
    facts: [
      { k: 'Role', v: 'Solo — daily user included' },
      { k: 'Timeline', v: 'Oct 2024 — present' },
      { k: 'Status', v: 'Live · deployed' },
      { k: 'Type', v: 'Web app · AI planning' },
    ],
    ask: 'How does Planno turn a brain-dump into a day plan?',
  },

  cybergame: {
    tagline: 'Security training people actually finish: a simulated phone feeds you texts, emails, and calls — you decide what\'s phishing.',
    overview: [
      'CyberGame makes security training feel like a game instead of a compliance chore. A fake phone screen feeds you messages — texts, emails, calls — and you call out what\'s phishing and what\'s legitimate. Fifty-plus scenarios, scoring, and levels that get meaner as you improve.',
      'The difficulty curve is the product: early rounds teach the obvious tells (urgency, weird domains, too-good offers), later rounds mimic the subtle social-engineering patterns that catch real people.',
    ],
    highlights: [
      { h: '50+ scenarios', p: 'Texts, emails, and calls drawn from real phishing patterns — not strawman examples.' },
      { h: 'Escalating difficulty', p: 'Levels progress from "obvious scam" to genuinely uncomfortable judgment calls.' },
      { h: 'Instant feedback', p: 'Every answer explains the tell you caught or missed — the explanation is the training.' },
      { h: 'Score & progression', p: 'Points and levels keep you playing long enough for the instincts to stick.' },
    ],
    story: [
      { k: 'Why I built it', h: "The slideshow version doesn't work", p: 'Corporate phishing training is a slideshow people click through. The knowledge only sticks if the reps feel real — so I made it a game with stakes and a score.' },
      { k: 'How it went', h: 'Flask, SQLite, and a fake phone', p: 'A REST API serves scenarios into a simulated phone UI. Keeping the interface believable — real-feeling messages, plausible senders — mattered more than any framework choice.' },
      { k: 'What I learned', h: 'The hard part was the difficulty curve', p: 'The interesting engineering wasn\'t the endpoints — it was tuning when the game gets harder so players stay in the zone between bored and defeated.' },
    ],
    stack: [
      { k: 'Backend', v: 'Python · Flask · REST API' },
      { k: 'Data', v: 'SQLite' },
      { k: 'Frontend', v: 'HTML · CSS · JavaScript' },
    ],
    facts: [
      { k: 'Role', v: 'Solo' },
      { k: 'Timeline', v: 'Dec 2025' },
      { k: 'Status', v: 'Complete' },
      { k: 'Type', v: 'Web game · Security education' },
    ],
    ask: 'What makes CyberGame different from normal security training?',
  },

  claudebot: {
    tagline: 'A personal Discord assistant on the Anthropic SDK — persistent memory in SQLite, and a real browser when a question needs the live web.',
    overview: [
      'Claudebot lives in my Discord servers and answers like an assistant that actually remembers. It\'s TypeScript on the official Anthropic SDK, with better-sqlite3 for persistent memory — so context survives restarts — and Playwright wired in so it can drive a real browser when a question needs the live web instead of training data.',
      'It\'s the project where I learned to think in tools: deciding what the model should answer directly versus when it should reach for the browser or the database.',
    ],
    highlights: [
      { h: 'Built on the Anthropic SDK', p: 'Streaming replies and structured tool use straight from the official SDK — no wrapper glue.' },
      { h: 'Memory that survives', p: 'better-sqlite3 keeps conversation memory on disk; the bot remembers your server across restarts.' },
      { h: 'A real browser on call', p: 'Playwright lets it fetch and read live pages when the answer isn\'t in the model.' },
      { h: 'Lives where we talk', p: 'No app to open — it answers in the channels my friends and clubs already use.' },
    ],
    story: [
      { k: 'Why I built it', h: 'The assistant should come to the chat', p: 'My groups organize life in Discord. Instead of everyone tabbing out to a chatbot, the chatbot should sit in the channel.' },
      { k: 'How it went', h: 'Giving it tools changed the design', p: 'Once the bot could browse and remember, the hard problem became orchestration — when to use which tool, and how to keep responses fast while a browser spins up behind the scenes.' },
      { k: 'What I learned', h: 'Deciding what it should not do', p: 'Claudebot was my first real agentic build: capability is easy, judgment is hard. Deciding what the bot won\'t do mattered as much as what it can.' },
    ],
    stack: [
      { k: 'Runtime', v: 'TypeScript · Node · discord.js' },
      { k: 'AI', v: 'Anthropic SDK (Claude)' },
      { k: 'Memory', v: 'better-sqlite3' },
      { k: 'Web access', v: 'Playwright' },
    ],
    facts: [
      { k: 'Role', v: 'Solo' },
      { k: 'Timeline', v: 'Feb 2026 — present' },
      { k: 'Status', v: 'Running daily' },
      { k: 'Type', v: 'Discord bot · Agent' },
    ],
    ask: 'What can Claudebot do in a Discord server?',
  },

  'buzzy-the-ai': {
    tagline: 'Where Digby started: a fully offline desktop assistant on Ollama and Llama 3, with profiles and personalities.',
    overview: [
      'Buzzy was my first swing at a personal AI: an Electron desktop assistant running Llama 3 through Ollama, completely offline. It had user profiles and customizable personalities — you could shape who Buzzy was, and everything stayed on your machine.',
      'It\'s on this page as an origin story, because every idea in Digby traces back here: local models, personality design, memory, and the conviction that a personal AI should be personal — yours, on your hardware.',
    ],
    highlights: [
      { h: '100% offline', p: 'Llama 3 through Ollama — no API keys, no cloud, no telemetry. The whole point.' },
      { h: 'Personalities', p: 'Configurable personas and profiles — an early lesson in how much voice shapes perceived intelligence.' },
      { h: 'The proving ground', p: 'Local inference, prompt design, memory experiments — the skills Digby is built on were learned here.' },
    ],
    story: [
      { k: 'Why I built it', h: 'Could a real assistant run on my laptop?', p: 'When small open models got good, I wanted to know how far one could go with zero cloud. Buzzy was the experiment.' },
      { k: 'How it went', h: 'Electron + Ollama, no safety net', p: 'Local inference means you own the whole failure surface — model management, context limits, cold starts. Debugging that taught me more than any API ever did.' },
      { k: 'What I learned', h: 'The rough draft did its job', p: 'Buzzy was rough, and that was fine — he became the requirements document for Digby. Shipping the rough version is how the good version gets designed.' },
    ],
    stack: [
      { k: 'Desktop', v: 'Electron · Python' },
      { k: 'AI', v: 'Ollama · Llama 3' },
    ],
    facts: [
      { k: 'Role', v: 'Solo' },
      { k: 'Timeline', v: 'Jan 2025' },
      { k: 'Status', v: 'Retired — evolved into Digby' },
      { k: 'Type', v: 'Desktop app · Origin story' },
    ],
    ask: 'How did Buzzy turn into Digby?',
  },

  'product-scraper': {
    tagline: 'Selenium automation that survives the real, messy web — search products, rank by rating and price, hand back a shortlist.',
    overview: [
      'The Product Scraper runs product searches through a headless Chrome, parses the results, ranks them by rating and price, and returns a clean shortlist. Simple idea; the education was in making it survive the actual web — layouts that shift, elements that load late, pages that lie.',
    ],
    highlights: [
      { h: 'Headless automation', p: 'Selenium driving Chrome through real search flows, not a brittle one-page script.' },
      { h: 'Ranked, usable results', p: 'Results come back scored by rating and price — a shortlist, not a data pile.' },
      { h: 'Built for the messy web', p: 'Waits, retries, and fallback selectors — the difference between a demo and a tool.' },
    ],
    story: [
      { k: 'Why I built it', h: 'Comparison shopping is robot work', p: 'Opening twelve tabs to compare the same product is exactly the kind of tedium automation exists for.' },
      { k: 'What I learned', h: 'The web fights back', p: 'Scraping taught me that error handling is the program. Everything since — including Claudebot\'s Playwright browsing — leans on lessons from here.' },
    ],
    stack: [
      { k: 'Runtime', v: 'Python' },
      { k: 'Automation', v: 'Selenium · headless Chrome' },
    ],
    facts: [
      { k: 'Role', v: 'Solo' },
      { k: 'Timeline', v: 'Apr 2025' },
      { k: 'Status', v: 'Complete' },
      { k: 'Type', v: 'Automation · Tooling' },
    ],
    ask: 'What did the Product Scraper teach Chris about automation?',
  },

  'this-portfolio': {
    tagline: 'The site you\'re on: a scroll-driven 3D dive, a living knowledge graph, and an AI that answers questions about me with citations.',
    overview: [
      'This portfolio is built to be explored, not scrolled. The home page opens with a Three.js dive; the Hive page lets you wander my actual knowledge graph by hand; and Digby — the mole in the corner — answers questions over it with real retrieval and citations, streaming from Gemini through a serverless function.',
      'Everything is one system: projects, posts, and skills live as nodes in one dataset, and the Hive page and Digby\'s brain both read from it. Add a project, and both learn it. The visual language — muted cream, professional orange, one serif with opinions — is a system I call Honey & Ink.',
    ],
    highlights: [
      { h: 'The dive', p: 'A scroll-driven Three.js tunnel that blooms into light as you land — frame-rate-independent easing, theme-aware rendering, reduced-motion safe.' },
      { h: 'The Hive', p: 'A force-directed graph of everything I\'ve built and learned — pannable, searchable, filterable.' },
      { h: 'Digby, live', p: 'Client-side retrieval over the graph, Gemini generation server-side, GenUI cards and safe navigation actions in the replies.' },
      { h: 'Honey & Ink', p: 'A token-driven design system with light and dark themes — soon to be extracted into its own open-source library.' },
    ],
    story: [
      { k: 'Why I built it', h: 'I wanted proof, not claims', p: 'Anyone can write "I know RAG." This site answers questions about my work with citations — the claim and the demo are the same artifact.' },
      { k: 'How it went', h: 'One dataset runs the whole site', p: 'The discipline was keeping content as data: hive.ts feeds the graph page and Digby\'s retrieval. No copy lives in components.' },
      { k: 'What I learned', h: 'The performance budget did me a favor', p: 'A strict performance budget — no shadows, capped pixel ratio, physics that sleep — forced the kind of engineering that reads as polish.' },
    ],
    stack: [
      { k: 'Frontend', v: 'React · TypeScript · Vite' },
      { k: '3D / Canvas', v: 'Three.js · Canvas 2D' },
      { k: 'AI', v: 'Gemini · RAG · GenUI protocol' },
      { k: 'Backend', v: 'Vercel serverless (SSE streaming)' },
    ],
    facts: [
      { k: 'Role', v: 'Solo — design system included' },
      { k: 'Timeline', v: '2026 — present' },
      { k: 'Status', v: 'In progress, always' },
      { k: 'Type', v: 'Portfolio · Playground' },
    ],
    ask: 'How does this site work under the hood?',
  },
};

export interface Post {
  num: string;
  title: string;
  sub: string;
  nodes: number;
  meta: string;
  featured?: boolean;
}

export const FEATURED_POST: Post = {
  num: '01', featured: true,
  title: 'Building Buzzy: an AI that only knows me',
  sub: 'Why a small, personal RAG system beats a general chatbot for a portfolio — the architecture, the embeddings, the memory design, and the honest limitations of an AI with one subject.',
  nodes: 6, meta: 'RAG · LLMS · MEMORY',
};

export const POSTS: Post[] = [
  { num: '02', title: 'What basketball taught me about shipping code', sub: "Practice players don't get the spotlight — they make the team better. On code review, pairing, and leading a club of fifty.", nodes: 4, meta: '8 MIN' },
  { num: '03', title: 'From portfolio to living knowledge base', sub: 'The build log for this site — the cinematic hero, the Hive, and why work should be explorable instead of scrollable.', nodes: 8, meta: '10 MIN' },
  { num: '04', title: 'Honey & Ink: designing my own identity system', sub: 'Muted creams, professional orange, one serif with opinions — how a favorite color became a full design language.', nodes: 3, meta: '6 MIN' },
  { num: '05', title: 'The Planno build log: an AI planner people actually open', sub: 'Decisions and dead-ends from ten months of building — and what weather data taught me about useful AI.', nodes: 5, meta: '9 MIN' },
];

export const ABOUT_FACTS = [
  { k: 'Based', v: 'Lake Grove, NY' },
  { k: 'School', v: 'Monmouth University' },
  { k: 'Degree', v: "B.S. Computer Science, '27" },
  { k: 'GPA', v: '3.9 / 4.0' },
  { k: 'Focus', v: 'AI · LLMs · Full-stack' },
  { k: 'Status', v: PROFILE.status, accent: true },
];

export const CHAPTERS = [
  { n: '01', k: 'The Spark', h: 'Where it started', p: "The first program that ran changed what I thought a computer was for. I stopped consuming software and started making it — and chose Monmouth's CS program to get serious about the craft.", tags: ['Class of 2027', '3.9 GPA'] },
  { n: '02', k: 'The Court', h: 'Learning to lead a locker room', p: "As Club Basketball president I run logistics, culture, and engagement for fifty-plus students. As a practice player for the Women's team, my whole job is making someone else better — the most transferable skill I own.", tags: ['Club President', 'Practice Player'] },
  { n: '03', k: 'The Build', h: 'Building outside the classroom', p: 'Planno, Buzzy, the scraper, and a long tail of experiments — ten-plus projects that turned coursework into instinct. The ones that failed taught the most; the ones that shipped are on the Work page.', tags: ['Python', 'React', 'Flask', 'LLMs'] },
  { n: '04', k: 'The Hive', h: 'Putting everything in one place', p: 'This site is the current project: every artifact I make becomes a node in one graph, and my own AI answers questions from it. The goal is a body of work you can interrogate, not just admire.', tags: ['Knowledge graph', 'RAG', 'Digby'] },
];

export const EDUCATION = {
  title: 'B.S. Computer Science — Monmouth University',
  date: 'EXPECTED MAY 2027',
  sub: "West Long Branch, NJ · GPA 3.9/4.0 · Dean's List, every semester to date",
  courses: ['Data Structures & Algorithms', 'Advanced OOP', 'Full-Stack Engineering', 'Discrete Math', 'Cybersecurity', 'Scripting Languages'],
};

export const EXPERIENCE = [
  { role: 'Busser — Danfords Hotel, Marina & Spa', org: 'Port Jefferson, NY', date: 'MAY 2024 — AUG 2025', note: 'High-volume hospitality at 500+ guests a day. Where I learned that systems under pressure — human or software — fail at their least-designed point.' },
  { role: 'Basketball Camp Counselor — Centereach HS', org: 'Centereach, NY', date: 'JUN 2023 — AUG 2023', note: 'Coached fundamentals to 50+ kids ages 5–13. Explaining a pick-and-roll to a seven-year-old is the best technical-communication training available.' },
];

export const AWARDS = ["Dean's List — Fall 2023", "Dean's List — Spring 2024", "Dean's List — Fall 2024", "Dean's List — Spring 2025"];
