// Buzzy — scripted concept replies. Swap `replyTo` for a real RAG call later;
// the UI already renders a `sources` line per message.

export interface BuzzyReply {
  /** trigger keywords (lowercased substring match) */
  k?: string[];
  /** the answer text */
  t: string;
  /** comma-joined source labels, or null */
  src: string | null;
}

export const BZ: BuzzyReply[] = [
  { k: ['learnai', 'consult', 'booking'], src: 'LearnAI · FastAPI · Supabase · Stripe', t: 'LearnAI is Chris\'s biggest build — an AI consulting platform where you book 1-on-1 sessions, browse projects, and pay through Stripe. React front, FastAPI back, Supabase database, OAuth sign-in, plus a Chrome extension that upgrades prompts on any AI site.\n```card\n{"type":"project","title":"LearnAI","body":"AI consulting platform — bookings, payments, and a prompt-enhancing extension.","tags":["React","FastAPI","Supabase","Stripe"],"to":"/work/learnai"}\n```' },
  { k: ['planno', 'planner'], src: 'Planno · Planno Build Log', t: 'Planno is Chris\'s AI daily planner. You brain-dump your morning, it hands back a time-boxed day with the big stuff broken into small, startable pieces. Deployed, and opened most mornings — which is the metric that matters.\n```card\n{"type":"project","title":"Planno","body":"AI daily planner — brain-dump in, time-boxed day out.","tags":["React","FastAPI","Claude"],"to":"/work/planno"}\n```' },
  { k: ['cybergame', 'cyber', 'phishing', 'security game'], src: 'CyberGame · Flask', t: 'CyberGame is a security-training sim Chris built: a fake phone feeds you texts and emails, and you call out what\'s phishing. 50+ scenarios, scoring, levels that get meaner as you improve.\n```card\n{"type":"project","title":"CyberGame","body":"Spot the phish — 50+ scenarios on a simulated phone.","tags":["Flask","Python"],"to":"/work/cybergame"}\n```' },
  { k: ['claudebot', 'discord'], src: 'Claudebot · Claude API', t: 'Claudebot is Chris\'s personal Discord assistant — TypeScript on the Anthropic SDK, SQLite memory, and Playwright when it needs the live web.\n```card\n{"type":"project","title":"Claudebot","body":"Discord assistant on the Anthropic SDK.","tags":["TypeScript","discord.js","Claude"],"to":"/work/claudebot"}\n```' },
  { k: ['digby', 'buzzy', 'bot', 'assistant', 'yourself', 'second brain', 'vault'], src: 'Digby · Buzzy the AI · MCP', t: 'That\'s me — Digby, Chris\'s local-first second brain. The desktop version indexes a markdown vault into a knowledge graph, answers over it with citations, and serves it to any AI tool over MCP. I started life as Buzzy, his offline Llama 3 assistant.\n```card\n{"type":"project","title":"Digby","body":"Local-first AI second brain — vault, graph, RAG, MCP.","tags":["Tauri","MCP","RAG","Ollama"],"to":"/work/digby"}\n```' },
  { k: ['hive', 'graph', 'knowledge', 'node'], src: 'This Portfolio · Knowledge Graphs · RAG', t: 'The Hive is the knowledge graph on its own page here — every project, post, and skill is a node, and the edges show how they relate. New work gets embedded and indexed on publish. I answer by retrieving from those nodes and citing them, which is classic RAG with a personal corpus.\n```action\n{"type":"navigate","to":"/hive","label":"Open the Hive"}\n```' },
  { k: ['story', 'journey'], src: 'Monmouth CS · About page', t: "Short version: CS student at Monmouth — 3.9 GPA, four straight Dean's List semesters, class of 2027 — who fell for the feeling of ideas actually running. He leads Club Basketball, practices with the Women's team, and ships AI projects in the gaps. The About page tells it in four chapters." },
  { k: ['basketball', 'court', 'sport', 'team'], src: 'Basketball to Shipping · Leadership', t: "He's Club Basketball president (fifty-plus members) and a practice player for the Women's team — a role whose entire job is making other people better. He wrote a post arguing that's also the job in code review. Worth a read on the Thoughts page." },
  { k: ['scraper', 'selenium', 'automation'], src: 'Product Scraper · Selenium', t: 'The Product Scraper is Python plus Selenium: it runs product searches, ranks by rating and price, and returns a shortlist. Browser automation that has to survive the real, messy web — which is where the learning was.' },
  { k: ['skill', 'stack', 'tech', 'language', 'tool'], src: 'AI / ML · Python · React', t: 'Core stack: Python, JavaScript and React, Flask, SQL, Git — with a deepening focus on LLMs, RAG, embeddings, and knowledge graphs. Plus Three.js, as the home page shows. Filter the Hive by Skills to see how it all connects.' },
  { k: ['contact', 'email', 'hire', 'intern', 'reach', 'touch'], src: 'cjpbuzaid@gmail.com', t: 'He\'s open to internships and collaborations. Email works best, or find him on LinkedIn and GitHub. I\'ll mention you stopped by.\n```card\n{"type":"contact"}\n```' },
  { k: ['work', 'project', 'built', 'shipped'], src: 'Work index · 8 builds', t: 'The Work page has eight builds: LearnAI (consulting platform), Digby (me, the desktop version), Planno (live AI planner), CyberGame, Claudebot, Buzzy (my origin story), the Product Scraper, and this site. More experiments sit on GitHub.\n```action\n{"type":"navigate","to":"/work","label":"See the work"}\n```' },
  { k: ['thought', 'blog', 'post', 'write', 'article', 'read'], src: 'Thoughts index', t: 'The Thoughts page holds the long-form writing — building me, basketball and shipping, the living knowledge base, and the Honey and Ink design system. Every article is auto-indexed into the Hive on publish, which is how I can cite passages.' },
  { k: ['site', 'portfolio', '3d', 'design'], src: 'This Portfolio · Three.js · Honey and Ink', t: 'This site is itself one of the projects: a scroll-driven hero, the full interactive Hive, and me — all in a muted cream and professional orange system Chris calls Honey and Ink. A portfolio you explore instead of scroll.' },
];

export const BZ_GREET: BuzzyReply = { src: null, t: 'Hey — welcome. Ask me about the work, the story, the Hive, or how to reach Chris.' };
export const BZ_FALLBACK: BuzzyReply = { src: 'the Hive', t: "I'm running in offline mode right now, so I only have my scripted notes — the live me retrieves from the Hive and cites exact nodes. Try asking about the work, the Hive, his story, basketball, or how to get in touch." };

export function replyTo(query: string): BuzzyReply {
  const s = query.toLowerCase();
  if (/^\s*(hi|hello|hey|yo|sup)\b/.test(s) && s.length < 25) return BZ_GREET;
  for (const r of BZ) {
    if (r.k && r.k.some((k) => s.includes(k))) return r;
  }
  return BZ_FALLBACK;
}

export const BUZZY_SUGGESTIONS = ['What is LearnAI?', 'Tell me about Digby', 'How do I reach Chris?'];
