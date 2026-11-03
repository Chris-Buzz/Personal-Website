// All page copy lives here so pages stay thin and data-driven.
// Facts were checked against Chris's notes, repos and the Brain eval on 2026-11-02.
// Add a date, number or claim only with a source. GTS appears only as the AI Research
// Intern role and dates (Chris, 2026-11-02), never a description of the work or the
// current part-time role. Left off on purpose: plans after graduation, Overlook Golf
// Center (an unpaid pitch), Tally, Murmur, the resume PDF.

export const PROFILE = {
  name: 'Christopher Buzaid',
  short: 'Chris Buzaid',
  email: 'cjpbuzaid@gmail.com',
  github: 'https://github.com/Chris-Buzz',
  githubHandle: 'Chris-Buzz',
  linkedin: 'https://www.linkedin.com/in/christopher-buzaid',
  photo: 'https://chrisbuzaid.dev/public/images/profile.jpg',
  location: 'Monmouth County, NJ',
  graduation: 'December 2026',
};

export const NAV = [
  { to: '/work', label: 'Work', icon: 'grid' },
  { to: '/map', label: 'Map', icon: 'map' },
  { to: '/about', label: 'About', icon: 'user' },
];

/** The thin bar above the header. It hides itself from `until` on, so stale news never ships. */
export const NEWS = {
  text: 'LearnAI paper at SIGCSE Virtual 2026, live session November 12 to 15.',
  link: { label: 'Read it', href: 'https://arxiv.org/abs/2608.19164' },
  until: '2026-11-16',
};

/* -- home --------------------------------------------------------------- */

export const HERO = {
  eyebrow: 'Solo developer · Computer science at Monmouth University',
  detail:
    'My own products, plus websites and tools for small businesses and family who don’t have them. Each one fits the tools people already use, gets measured before anyone trusts it, and keeps data where it belongs.',
};

export const NOW = {
  when: 'November 2026',
  items: [
    { to: '/work/learnai', title: 'LearnAI paper', body: 'Co-authored, at SIGCSE Virtual 2026. Live session November 12 to 15.' },
    { to: '/work/common-memory', title: 'Common Memory', body: 'One memory for every AI tool I use, measured with a 36-case recall test.' },
    { to: '/work/buzzoff', title: 'Buzz Off', body: 'My senior project, a party game where phones are the controllers.' },
  ],
};

export const CONTEXT = [
  { k: 'Building', v: 'Common Memory, Buzz Off, Planno' },
  { k: 'Research', v: 'LearnAI, Monmouth University' },
  { k: 'Previously', v: 'IBM z/OSMF, summer 2026' },
  { k: 'Based in', v: 'Monmouth County, NJ' },
];

export interface Proof {
  src: string;
  /** the evidence itself, set in bold at the start of the line */
  lead: string;
  text: string;
  to: string;
}

export interface Principle {
  key: string;
  h: string;
  why: string;
  proof: Proof[];
}

export const PRINCIPLES: Principle[] = [
  {
    key: 'Integration',
    h: 'Put AI where the work already happens.',
    why: 'A tool in a separate tab gets forgotten. It has to show up inside the editor, the test suite or the chat people already use.',
    proof: [
      { src: 'IBM', lead: 'A custom mode for Bob,', text: 'IBM’s AI coding agent, that walks developers through writing functional verification tests.', to: '/about' },
      { src: 'Common Memory', lead: 'One memory', text: 'gathered from Claude Code, Codex, Cursor, Antigravity and Gemini, handed back to whichever one I use.', to: '/work/common-memory' },
    ],
  },
  {
    key: 'Evaluation',
    h: 'Measure it before trusting it.',
    why: 'A demo that worked once proves very little. A fixed test set shows whether a change helped or only felt like it did.',
    proof: [
      { src: 'Common Memory', lead: '81.3% to 100%', text: 'hit in the top 4 on a 36-case recall test. Graph RAG scored lower and stayed out.', to: '/work/common-memory' },
      { src: 'IBM', lead: 'Functional verification tests', text: 'for the z/OSMF REST APIs.', to: '/about' },
    ],
  },
  {
    key: 'Governance',
    h: 'Keep a person accountable for the result.',
    why: 'The model drafts. A person frames the problem, checks the output and owns the decision.',
    proof: [
      { src: 'LearnAI', lead: 'Five stages per session,', text: 'from framing the problem to verification, ending in ethical reflection.', to: '/work/learnai' },
      { src: 'Common Memory', lead: 'Dated, sourced notes.', text: 'A newer decision supersedes an older one instead of erasing it.', to: '/work/common-memory' },
    ],
  },
  {
    key: 'Privacy',
    h: 'Keep data where it belongs.',
    why: 'Run the smallest model that does the job, as close to the data as possible, and refuse to move what should stay put.',
    proof: [
      { src: 'Planno', lead: 'SQLite on the iPhone', text: 'holds everything a person writes. A cloud model is opt-in, with their own key.', to: '/work/planno' },
      { src: 'Common Memory', lead: 'Local models', text: 'for embeddings and answers. A sync refuses anything that looks like a secret.', to: '/work/common-memory' },
    ],
  },
];

/* -- projects ----------------------------------------------------------- */

export type Tone = 'live' | 'progress' | 'planned';

export interface Stat {
  value: string;
  label: string;
  /** a target or work in progress, shown apart from measured results */
  plan?: string;
}

export type Evidence =
  | { kind: 'recall' }
  | { kind: 'stats'; source: { title: string; detail: string }; items: Stat[]; note: string }
  | { kind: 'image'; src: string; alt: string; width: number; height: number; caption: string };

export interface Project {
  slug: string;
  num: string;
  title: string;
  year: string;
  status: { label: string; tone: Tone };
  summary: string;
  figure: Stat;
  tags: string[];
  tagline: string;
  meta: { k: string; v: string }[];
  /** `href` opens another site in a new tab; `to` is a page on this one */
  links: ({ label: string; href: string } | { label: string; to: string })[];
  /** shown where a repo or live link would normally go */
  note?: string;
  problem: string[];
  how: { h: string; p: string }[];
  evidence?: Evidence;
  decisions: { h: string; p: string }[];
  standing: { item: string; state: string; tone: Tone }[];
  /** prompt for the portfolio guide */
  ask: string;
  /** other words that should find this project in the guide's saved replies */
  aliases?: string[];
  /** real images from the project, shown under "How it works" */
  gallery?: Picture[];
}

export interface Picture {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export const PROJECTS: Project[] = [
  {
    slug: 'common-memory',
    num: '01',
    title: 'Common Memory',
    year: '2026',
    status: { label: 'In daily use', tone: 'live' },
    summary: 'One memory for every AI tool I use. Local retrieval, measured with a test set, with guardrails that keep secrets out.',
    figure: { value: '81.3% → 100%', label: 'Recall, hit in the top 4, on a 36-case test' },
    tags: ['Node.js', 'LanceDB', 'Ollama', 'Evaluation'],
    tagline: 'One memory across every AI tool I use, kept on my own machine and measured before I trust it.',
    meta: [
      { k: 'Role', v: 'Designed and built it, solo' },
      { k: 'Timeline', v: '2026, ongoing' },
      { k: 'Status', v: 'In daily use, local only' },
      { k: 'Built with', v: 'Node.js, LanceDB, Ollama, Markdown in Git' },
    ],
    links: [],
    aliases: ['memory'],
    note: 'The code is private by choice, so this page explains it with a diagram instead of a repo link. No vault contents appear here.',
    problem: [
      'I use five AI tools on my PC (Claude Code, Codex, Cursor, Antigravity and Gemini) plus ChatGPT and Claude.ai in the browser. Each keeps its own memory or none, so a decision made in one is invisible to the next, and I kept explaining the same project again.',
      'The cloud assistants offer data exports but no way to read their memory. So the memory had to live somewhere I control, in plain files that any tool can be handed.',
    ],
    how: [
      {
        h: 'Collect',
        p: 'A digest step reads each tool’s local history (Claude Code transcripts, Codex and Cursor databases, Antigravity summaries, Gemini CLI chats). An import step reads ChatGPT, Claude.ai and Gemini export files. Each chat becomes a dated session note that records which tool it came from.',
      },
      {
        h: 'Guard',
        p: 'Before anything is written, text that looks like an API key, token or password is replaced with [redacted], and lines that mention a blocked term are dropped. The blocked terms are a list I control.',
      },
      {
        h: 'Store',
        p: 'The memory is plain Markdown in a private Git repository, one fact per note, each with a date and a source. I read and edit it in Obsidian. A sync refuses to commit if the staged changes look like a secret or carry a controlled-information marking.',
      },
      {
        h: 'Index',
        p: 'Each note is split into chunks and embedded by nomic-embed-text, a small embedding model running in Ollama on my PC. LanceDB, an embedded vector database stored on disk, keeps the vectors and a full-text index of the same chunks.',
      },
      {
        h: 'Recall',
        p: 'A question is scored two ways, by meaning (how close its embedding is to each chunk) and by words (BM25, a classic keyword ranking), and the scores are blended. A question about a date or a tool is narrowed to notes from that date or tool first.',
      },
      {
        h: 'Deliver',
        p: 'A hook adds the best notes to each Claude Code prompt. A generated profile block keeps Codex and Gemini current, and a short version can be pasted into ChatGPT or Claude.ai. An ask command has a local model answer from the six best notes and cite them.',
      },
    ],
    evidence: { kind: 'recall' },
    decisions: [
      {
        h: 'Left graph RAG out.',
        p: 'One hop along note links scored below plain hybrid recall, 93.8% against 100%. At a few hundred notes, the links already sit inside the notes that rank. I will measure it again once the vault passes a few thousand.',
      },
      {
        h: 'One retrieval, no agent loop.',
        p: 'The first search already puts an expected note in the top 4 for every test question, so a multi-step loop would add waiting without adding answers.',
      },
      {
        h: 'No app and no server.',
        p: 'I built a desktop app and removed it the same day. Obsidian is the window and hooks do the work. Nothing is hosted, so there is no endpoint for anyone else to query.',
      },
      {
        h: 'Dropped the persona.',
        p: 'Common Memory is the useful part of Digby, a personal-assistant project I shelved on November 1, 2026. I kept the memory problem and dropped the character.',
      },
    ],
    standing: [
      { item: 'Recall, the ask command and the auto-recall hook', state: 'In daily use', tone: 'live' },
      { item: 'Chats from Claude Code, Codex, Cursor, Antigravity and Gemini CLI', state: 'Read at the start of each session', tone: 'live' },
      { item: 'ChatGPT, Claude.ai and Gemini export imports', state: 'Built and tested on sample files', tone: 'progress' },
      { item: 'Reranker and graph expansion', state: 'Measured, not needed at this size', tone: 'planned' },
      { item: 'Public release', state: 'Not planned', tone: 'planned' },
    ],
    ask: 'How does Common Memory work, and how was it measured?',
  },
  {
    slug: 'learnai',
    num: '02',
    title: 'LearnAI',
    year: '2025 to 2026',
    status: { label: 'Paper published', tone: 'live' },
    summary: 'A Monmouth University program that teaches people to use AI on their own work, and the co-authored paper that documents it.',
    figure: { value: '293', label: 'Students reached by class visits in 18 courses' },
    tags: ['Human-led AI', 'Research', 'React', 'FastAPI'],
    tagline: 'Teaching people to use AI on work they already care about, with a person in the loop.',
    meta: [
      { k: 'Role', v: 'Paper co-author, booking-site developer' },
      { k: 'Timeline', v: 'October 2025 to now' },
      { k: 'Status', v: 'Paper published, site live' },
      { k: 'Built with', v: 'React, FastAPI, Supabase' },
    ],
    links: [{ label: 'Read the paper on arXiv', href: 'https://arxiv.org/abs/2608.19164' }],
    problem: [
      'Knowing AI exists is different from using it well on your own work. A general demo shows what a tool can do and then leaves people alone with a blank prompt.',
      'LearnAI, a program at Monmouth University, pairs people with a tutor and a problem of their own, so the learning happens on real work.',
    ],
    how: [
      { h: 'Class visits', p: '15-minute visits introduced the tools in 18 courses across five disciplines.' },
      { h: 'One-on-one sessions', p: 'Hour-long sessions with an undergraduate tutor, built around something the person is already working on.' },
      {
        h: 'A five-stage script',
        p: 'Each session moves through problem framing, matching the task to a tool, prompting together, deployment and verification, and ethical reflection.',
      },
      { h: 'The booking site', p: 'lainow.com is where people find the program and book a session. I wrote most of its code, with help from teammates.' },
    ],
    evidence: {
      kind: 'stats',
      source: {
        title: 'LearnAI: Just-in-Time AI Co-Creation Across Disciplines at a University.',
        detail: 'Weihao Qu, Ling Zheng, Chris Buzaid and Daniel Crawford. SIGCSE Virtual 2026.',
      },
      items: [
        { value: '293', label: 'Students in class visits' },
        { value: '15', label: 'Faculty in class visits' },
        { value: '18', label: 'Courses across five disciplines' },
        { value: '70+', label: 'One-on-one sessions' },
        { value: '35', label: 'People served one on one' },
        { value: '4', label: 'Undergraduate tutors' },
      ],
      note: 'Covers Fall 2025 and Spring 2026. The program and its results belong to the whole team.',
    },
    decisions: [
      {
        h: 'A person stays in the loop.',
        p: 'Tutors frame the problem and check the result with the learner. The AI helps draft, and the person decides what is good enough.',
      },
      {
        h: 'Teach it just in time.',
        p: 'A tool is introduced at the moment someone needs it for their own work, not ahead of time in the abstract.',
      },
      {
        h: 'Strip the site to booking.',
        p: 'The first site advertised features that were never finished. The rebuild keeps only what the program uses, which is learning about it and booking a session.',
      },
    ],
    standing: [
      { item: 'Paper', state: 'Published at SIGCSE Virtual 2026. Live session November 12 to 15', tone: 'live' },
      { item: 'Program', state: 'Documented through Spring 2026', tone: 'live' },
      { item: 'Booking site', state: 'Live at lainow.com, with a smaller rebuild in progress', tone: 'live' },
    ],
    ask: 'What did Chris contribute to LearnAI?',
  },
  {
    slug: 'buzzoff',
    num: '03',
    title: 'Buzz Off',
    year: '2026',
    status: { label: 'In development', tone: 'progress' },
    summary: 'My senior project. A living-room party game where the TV is the show and each phone is a prop in your hand.',
    figure: { value: '3 games', label: 'Bowling, golf and Hot Lap. The senior project is due December 2026', plan: 'In progress' },
    tags: ['Expo', 'React Native', 'Three.js', 'Multiplayer'],
    tagline: 'The TV is the show, and each phone is a prop in your hand.',
    meta: [
      { k: 'Role', v: 'Designer and developer' },
      { k: 'Timeline', v: 'Fall 2026 senior project' },
      { k: 'Status', v: 'In development' },
      { k: 'Built with', v: 'Expo, React Native, Three.js, Rapier' },
    ],
    links: [],
    problem: [
      'Game nights tend to end with everyone on their own phone. I wanted a game for a group of friends in one room that gets people off their phones by making the phone part of the game.',
      'It is my senior project for my computer science degree at Monmouth, and I want it to be a real product people use at parties, not a class demo.',
    ],
    how: [
      { h: 'The TV is the show', p: 'The shared screen runs the scene everyone watches, like the bowling alley, the golf hole or the race track, so eyes stay up.' },
      { h: 'The phone is a prop', p: 'Each phone becomes the thing in your hand, a bowling ball, a golf club or a steering wheel in Hot Lap. Its motion sensors read the swing or the tilt.' },
      { h: 'Anyone can join', p: 'Guests join from a phone browser with no account. The iPhone app is the full version.' },
      {
        h: 'One server keeps score',
        p: 'A small server keeps track of the game night (who joined, whose turn it is, the scores) and passes messages between the phones and the TV.',
      },
    ],
    evidence: {
      kind: 'image',
      src: '/projects/buzzoff-bowling.jpg',
      alt: 'A round cartoon bowler in a red, white and blue headband holding a blue bowling ball in a lit bowling alley.',
      width: 536,
      height: 724,
      caption: 'Bowling artwork from the game',
    },
    gallery: [
      {
        src: '/projects/buzzoff/lane.webp',
        alt: 'An empty bowling lane of polished wood with ten pins at the end and a glowing orange crown above them.',
        caption: 'The alley',
        width: 640,
        height: 960,
      },
      {
        src: '/projects/buzzoff/golf.webp',
        alt: 'A round green character in a golf-ball cap lining up a putt beside the flag.',
        caption: 'Golf',
        width: 533,
        height: 724,
      },
      {
        src: '/projects/buzzoff/cast.webp',
        alt: 'Eight round characters piled together, each dressed for a sport: basketball, golf, bowling, baseball and more.',
        caption: 'The cast',
        width: 512,
        height: 847,
      },
    ],
    decisions: [
      { h: 'Three games done properly first.', p: 'Bowling, golf and Hot Lap each have to be great from start to finish before more games get added. A few easy party games come next.' },
      { h: 'The TV is a web page.', p: 'Any screen with a browser can be the TV, so there is nothing to install on it.' },
      { h: 'No accounts for now.', p: 'A guest should be able to join from the couch in a browser. Accounts can wait until something needs them.' },
    ],
    standing: [
      { item: 'Bowling', state: 'TV scene and phone controller built', tone: 'progress' },
      { item: 'Golf', state: 'TV scene and phone controller built. The swing still needs testing in real hands', tone: 'progress' },
      { item: 'Hot Lap', state: 'One track playable end to end', tone: 'progress' },
      { item: 'Party games', state: 'In progress', tone: 'progress' },
      { item: 'App blocking through Screen Time', state: 'Planned', tone: 'planned' },
      { item: 'TestFlight', state: 'First build uploaded October 23, 2026', tone: 'live' },
    ],
    ask: 'What is Buzz Off and where does it stand?',
  },
  {
    slug: 'planno',
    num: '04',
    title: 'Planno',
    year: '2026',
    status: { label: 'In development', tone: 'progress' },
    summary: 'An iPhone app for people who run many projects at once. Talk to capture a thought, then stay on one project until you choose to switch.',
    figure: { value: '4 mornings', label: 'Of real use in one week, by December 14, 2026', plan: 'Target' },
    tags: ['Expo', 'SQLite', 'On-device AI'],
    tagline: 'Capture the thought. Stay on the next step.',
    meta: [
      { k: 'Role', v: 'Designer and developer' },
      { k: 'Timeline', v: '2026' },
      { k: 'Status', v: 'In development' },
      { k: 'Built with', v: 'Expo, React Native, SQLite' },
    ],
    links: [],
    problem: [
      'Ideas arrive at the wrong time, and switching between projects costs more than it should. Planners usually ask you to sort everything first, which is the part that slips.',
      'Planno is an iPhone app for people who run many projects at once, built first for people with ADHD. I am its first user.',
    ],
    how: [
      { h: 'Talk to capture', p: 'Say the thought. Planno files it into the right project’s roadmap and shows a receipt you can undo.' },
      { h: 'One project in focus', p: 'The app keeps one project and its next step in front of you until you choose to switch.' },
      {
        h: 'Everything on the phone',
        p: 'Projects and captures live in SQLite on the iPhone, with no account and no sync. A model only judges small questions, like which project a thought belongs to.',
      },
      {
        h: 'Three tiers of AI',
        p: 'Apple’s on-device model where the phone supports it, Claude Haiku with your own API key if you opt in, or plain rules with no model at all.',
      },
    ],
    decisions: [
      { h: 'Smaller on purpose.', p: 'Earlier versions were a web planner with much more surface. This one does capture and focus, and nothing else until those hold up.' },
      { h: 'Phone only.', p: 'With data on the phone, nothing a person writes has to leave it by default, and there is no server holding anyone’s notes.' },
      { h: 'Your key, never one in the app.', p: 'A key bundled in an app can be pulled out of it, so the cloud tier uses the person’s own key, stored in the iPhone Keychain.' },
    ],
    standing: [
      { item: 'Phone-only build', state: 'Built October 25, 2026', tone: 'live' },
      { item: 'Development build on an iPhone 13', state: 'Next', tone: 'planned' },
      { item: 'Four real mornings in one week', state: 'The finish line, by December 14, 2026', tone: 'planned' },
    ],
    ask: 'What is the current scope of Planno?',
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/* -- more work: smaller projects, work at IBM, and the skills and tools I built ------ */

export type MoreKind = 'Project' | 'At IBM' | 'Skill or tool';

export interface MoreItem {
  id: string;
  title: string;
  kind: MoreKind;
  year: string;
  line: string;
  tags: string[];
  status: { label: string; tone: Tone };
  /** `href` opens another site in a new tab; `to` is a page on this one */
  link?: { label: string; href: string } | { label: string; to: string };
  /** how a visitor installs or downloads it */
  install?: Install;
}

export type Install =
  /** a Claude Code plugin from the skills marketplace below */
  | { kind: 'plugin'; plugin: string; needs: string }
  /** a public repo: clone it or download it as a ZIP */
  | { kind: 'repo'; repo: string; branch: string };

/** The public Claude Code plugin marketplace for Chris's skills. */
export const SKILLS = {
  repo: 'Chris-Buzz/claude-skills',
  marketplace: 'chris-buzz',
  /** Flip to true once the repo is public on GitHub; until then the site hides the plugin install commands. */
  published: false,
};

export const pluginCommands = (plugin: string) => [
  `/plugin marketplace add ${SKILLS.repo}`,
  `/plugin install ${plugin}@${SKILLS.marketplace}`,
];
export const repoZip = (repo: string, branch: string) => `https://github.com/${repo}/archive/refs/heads/${branch}.zip`;

// Sources, checked 2026-11-02: Murmur from its repo README (vault hub), RollCallQR from the README and commit
// history of Chris-Buzz/Teaching_Management_System, buzz-and-ink from its public repo, IBM from EXPERIENCE below,
// the skills and the bridge from their own files and creation dates in Chris's Claude config.
export const MORE: MoreItem[] = [
  {
    id: 'murmur',
    title: 'Murmur',
    kind: 'Project',
    year: '2026',
    line: 'Dictation that runs on my own PC. Hold a hotkey and speak, and whisper turns it into text on the GPU, a local model tidies it up, and it pastes where the cursor is. No cloud and no account. Built on Handy by CJ Pais.',
    tags: ['Rust', 'Tauri', 'whisper', 'Ollama'],
    status: { label: 'In development', tone: 'progress' },
  },
  {
    id: 'rollcallqr',
    title: 'RollCallQR',
    kind: 'Project',
    year: '2025',
    line: 'Attendance by QR code. A teacher opens a fresh code for each class session, students scan it to check in without logging in, and the teacher gets per-student reports and a CSV export.',
    tags: ['Flask', 'PostgreSQL', 'Supabase', 'Vercel'],
    status: { label: 'Built in November 2025', tone: 'live' },
  },
  {
    id: 'bob-mode',
    title: 'A test-writing mode for Bob',
    kind: 'At IBM',
    year: '2026',
    line: 'Helped build a custom mode for Bob, IBM’s AI coding agent, that walks developers through the full test-generation process. I also led a team workshop on getting more out of Bob.',
    tags: ['Bob', 'Test generation', 'z/OSMF'],
    status: { label: 'Summer 2026', tone: 'live' },
    link: { label: 'Experience', to: '/about' },
  },
  {
    id: 'generative-ui',
    title: 'Generative UI prototypes',
    kind: 'At IBM',
    year: '2026',
    line: 'Prototyped generative UI features with the Vercel AI SDK on local models, where the model answers with interface pieces instead of only text.',
    tags: ['Vercel AI SDK', 'Local models'],
    status: { label: 'Summer 2026', tone: 'live' },
    link: { label: 'Experience', to: '/about' },
  },
  {
    id: 'my-design',
    title: '/my-design',
    kind: 'Skill or tool',
    year: '2026',
    line: 'My design process as a Claude Code skill. It researches the people a product is for, drafts a design system with me, has ChatGPT draw four concepts I pick from, builds a board of every page, then runs design and accessibility reviews.',
    tags: ['Claude Code skill', 'Design systems'],
    status: { label: 'In use since October 2026', tone: 'live' },
    install: { kind: 'plugin', plugin: 'my-design', needs: 'Claude Code. The concept step uses the ChatGPT bridge.' },
  },
  {
    id: 'council',
    title: 'Council',
    kind: 'Skill or tool',
    year: '2026',
    line: 'A review with three kinds of reviewer. Fresh Claude reviewers, Codex and Gemini read the same packet without seeing each other’s notes, and every finding is checked against the source before it counts. It reports and never edits.',
    tags: ['Claude Code skill', 'Codex', 'Gemini'],
    status: { label: 'Built November 2026', tone: 'live' },
    install: { kind: 'plugin', plugin: 'council', needs: 'Claude Code, plus the Codex and Antigravity command-line tools for the outside reviewers.' },
  },
  {
    id: 'chatgpt-bridge',
    title: 'ChatGPT bridge',
    kind: 'Skill or tool',
    year: '2026',
    line: 'An MCP server that lets Claude Code use my own ChatGPT in a visible Chrome window, for a second opinion or concept art. It hands back text and file paths instead of whole pages, so a round trip costs a few hundred tokens.',
    tags: ['MCP', 'Node.js', 'Playwright'],
    status: { label: 'In use since October 2026', tone: 'live' },
    install: { kind: 'plugin', plugin: 'chatgpt-bridge', needs: 'Claude Code, Node.js, Chrome and your own ChatGPT account. Run npm install once in the plugin folder.' },
  },
  {
    id: 'buzz-and-ink',
    title: 'Buzz & Ink',
    kind: 'Skill or tool',
    year: '2026',
    line: 'My design system in plain CSS with no dependencies: tokens and components, with forced-colors fallbacks and status that never relies on colour alone. This site uses its second version.',
    tags: ['CSS', 'Design tokens'],
    status: { label: 'Public on GitHub', tone: 'live' },
    link: { label: 'GitHub', href: 'https://github.com/Chris-Buzz/buzz-and-ink' },
    install: { kind: 'repo', repo: 'Chris-Buzz/buzz-and-ink', branch: 'main' },
  },
];

/* -- Brain recall results (node scripts/brain.mjs eval --mode all) ------ */

export const RECALL = {
  questions: 32,
  unrelated: 4,
  before: '81.3%',
  after: '100%',
  measured: 'November 1, 2026',
  rerun: 'November 2, 2026',
  rows: [
    { name: 'Words only', detail: 'BM25 keyword ranking', hit: 90.6, mrr: 0.776 },
    { name: 'Meaning only', detail: 'nomic-embed-text vectors', hit: 87.5, mrr: 0.76 },
    { name: 'Hybrid', detail: 'Meaning first, words break ties', hit: 100, mrr: 0.867, chosen: true },
    { name: 'Hybrid plus graph', detail: 'Adds one hop along note links', hit: 93.8, mrr: 0.853 },
  ],
  hookFound: '93.8%',
  hookFalseAlarms: '0',
};

/* -- about -------------------------------------------------------------- */

export const ABOUT = {
  lede: 'I study computer science at Monmouth University and graduate in December 2026. I build my own AI products, plus websites and tools for small businesses and family who don’t have them, and I like learning each thing properly.',
  facts: [
    { k: 'School', v: 'Monmouth University, B.S. Computer Science' },
    { k: 'Graduating', v: 'December 2026' },
    { k: 'GPA', v: '3.9 / 4.0' },
    { k: 'Dean’s List', v: 'Every semester, Fall 2023 to Spring 2026' },
    { k: 'Based in', v: 'Monmouth County, NJ' },
  ],
};

export interface Role {
  org: string;
  role: string;
  place: string;
  date: string;
  points: string[];
}

export const EXPERIENCE: Role[] = [
  {
    org: 'IBM',
    role: 'Backend Developer Intern, z/OSMF',
    place: 'Poughkeepsie, NY',
    date: 'May to August 2026',
    points: [
      'Wrote functional verification tests for the z/OSMF REST APIs.',
      'Prototyped generative UI features with the Vercel AI SDK on local models.',
      'Helped build a custom mode for Bob, IBM’s AI coding agent, that walks developers through the full test-generation process.',
      'Led a team workshop on getting more out of Bob.',
    ],
  },
  {
    org: 'General Technical Services (GTS)',
    role: 'AI Research Intern',
    place: 'Wall Township, NJ',
    date: 'January to May 2026',
    points: [],
  },
  {
    org: 'Monmouth University',
    role: 'AI Research Assistant, LearnAI',
    place: 'West Long Branch, NJ',
    date: 'October 2025 to now',
    points: [
      'Co-authored the LearnAI paper for SIGCSE Virtual 2026.',
      'Wrote most of the code for lainow.com, the program’s booking site, with help from teammates.',
    ],
  },
];

export const PAPER = {
  title: 'LearnAI: Just-in-Time AI Co-Creation Across Disciplines at a University',
  authors: 'Weihao Qu, Ling Zheng, Chris Buzaid, Daniel Crawford',
  venue: 'SIGCSE Virtual 2026',
  id: 'arXiv:2608.19164',
  href: 'https://arxiv.org/abs/2608.19164',
};

export const BEYOND =
  'Former president of Monmouth Club Basketball. I have also been a practice player for the women’s team, where the whole job is making someone else better.';
