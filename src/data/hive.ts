// The knowledge graph — single source of truth for The Hive page and for
// Digby's retrieval. Add work here and both pick it up.
// NOTE: the home cinematic used to render this as a closing "constellation" —
// Chris hated it and it was removed (July 2026). Don't re-add it.

export type NodeType = 'project' | 'post' | 'skill' | 'life';

export interface HiveNode {
  label: string;
  type: NodeType;
  desc: string;
}

export const TYPE_META: Record<NodeType, { label: string; r: number }> = {
  project: { label: 'Project', r: 13 },
  post: { label: 'Post', r: 9 },
  skill: { label: 'Skill', r: 6 },
  life: { label: 'Life', r: 8 },
};

const N = (label: string, type: NodeType, desc: string): HiveNode => ({ label, type, desc });

export const nodes: HiveNode[] = [
  N('LearnAI', 'project', 'AI consulting platform — book 1-on-1 sessions, project showcase, Stripe payments, OAuth sign-in, and a Chrome extension that upgrades prompts on any AI site.'),
  N('Digby', 'project', 'Local-first AI second brain — a markdown vault indexed into a self-building knowledge graph, RAG chat with citations, and an MCP layer so any AI tool can read it. Also the assistant on this site.'),
  N('CyberGame', 'project', 'Cybersecurity training sim — spot phishing and social engineering on a realistic phone. 50+ scenarios, scoring, escalating levels.'),
  N('Claudebot', 'project', 'Personal Discord assistant on the Anthropic SDK — SQLite memory, Playwright browsing.'),
  N('Planno', 'project', 'AI-powered daily planner. Brain-dump in, time-boxed day out. Live on Vercel and opened most mornings.'),
  N('Buzzy the AI', 'project', "Offline desktop assistant on Ollama + Llama 3 with profiles and custom personalities. Digby's origin story."),
  N('Product Scraper', 'project', 'Selenium automation that searches, ranks, and returns products by rating and price.'),
  N('This Portfolio', 'project', 'A scroll-driven cinematic, the full Hive, and Digby answering with citations.'),
  N('Building Buzzy', 'post', 'Why a small personal RAG system beats a general chatbot — architecture, embeddings, honest limitations.'),
  N('Basketball to Shipping', 'post', 'What being a practice player and club president taught me about code review and showing up.'),
  N('Living Knowledge Base', 'post', 'The build log for this site: turning every artifact into nodes Buzzy can cite.'),
  N('Planno Build Log', 'post', 'Decisions and dead-ends from building an AI planner people actually use.'),
  N('Honey and Ink', 'post', 'Designing an identity system from a favorite color: muted cream, professional orange, one opinionated serif.'),
  N('Python', 'skill', 'Primary language — automation, AI, backends.'),
  N('JavaScript', 'skill', 'Front-end interactivity and tooling.'),
  N('React', 'skill', 'Component-driven UIs.'),
  N('Flask', 'skill', 'Lightweight Python backends and APIs.'),
  N('AI / ML', 'skill', 'Core focus across coursework and projects.'),
  N('LLMs', 'skill', 'Prompting, local inference, evaluation.'),
  N('RAG', 'skill', 'Retrieval-augmented generation — how Buzzy reads this graph.'),
  N('Embeddings', 'skill', 'Vector representations that connect the Hive.'),
  N('Selenium', 'skill', 'Browser automation at scale.'),
  N('Electron', 'skill', 'Cross-platform desktop apps.'),
  N('Three.js', 'skill', '3D scenes on the web — like the home page hero.'),
  N('Ollama', 'skill', 'Local model runtime behind Buzzy.'),
  N('Llama 3', 'skill', 'The local model itself — fully offline.'),
  N('Gemini API', 'skill', "LLM powering Planno's suggestions."),
  N('Knowledge Graphs', 'skill', 'Connecting ideas as first-class data.'),
  N('Git', 'skill', 'Version control, public by default.'),
  N('SQL', 'skill', 'Relational data modeling.'),
  N('Vercel', 'skill', 'Deployment target for Planno, this site, and beyond.'),
  N('TypeScript', 'skill', 'Typed JavaScript — Digby, Claudebot, and this site.'),
  N('FastAPI', 'skill', 'Modern Python APIs — LearnAI, Digby, and Planno backends.'),
  N('Supabase', 'skill', 'Postgres + auth + storage behind LearnAI.'),
  N('Tauri', 'skill', "Rust-based desktop shell — Digby's home."),
  N('MCP', 'skill', 'Model Context Protocol — how Digby serves your vault to any AI tool.'),
  N('Stripe', 'skill', 'Payments infrastructure — LearnAI bookings.'),
  N('Claude API', 'skill', 'Anthropic models — Claudebot, LearnAI, and Planno suggestions.'),
  N('Monmouth CS', 'life', 'B.S. Computer Science, Class of 2027. GPA 3.9/4.0.'),
  N("Dean's List x4", 'life', 'Every semester so far.'),
  N('Club Basketball Pres.', 'life', 'Leading 50+ students — logistics, culture, engagement.'),
  N('Practice Player', 'life', "Making the Women's team better by simulating game scenarios."),
  N('Leadership', 'life', 'The thread connecting the court and the codebase.'),
  N('Camp Coach', 'life', 'Taught basketball fundamentals to 50+ kids — best communication training there is.'),
  N('Danfords', 'life', 'High-volume hospitality: systems under pressure fail at their least-designed point.'),
];

const idx: Record<string, number> = {};
nodes.forEach((n, i) => (idx[n.label] = i));

const E = (a: string, b: string): [number, number] | null => {
  if (idx[a] === undefined || idx[b] === undefined) return null;
  return [idx[a], idx[b]];
};

export const edges: [number, number][] = (
  [
    E('LearnAI', 'React'), E('LearnAI', 'FastAPI'), E('LearnAI', 'Supabase'), E('LearnAI', 'Stripe'), E('LearnAI', 'Claude API'), E('LearnAI', 'Digby'),
    E('Digby', 'Tauri'), E('Digby', 'TypeScript'), E('Digby', 'FastAPI'), E('Digby', 'RAG'), E('Digby', 'Knowledge Graphs'), E('Digby', 'MCP'), E('Digby', 'Ollama'), E('Digby', 'Embeddings'), E('Digby', 'Buzzy the AI'),
    E('CyberGame', 'Flask'), E('CyberGame', 'Python'), E('CyberGame', 'SQL'),
    E('Claudebot', 'TypeScript'), E('Claudebot', 'Claude API'),
    E('MCP', 'LLMs'), E('Claude API', 'LLMs'), E('TypeScript', 'JavaScript'), E('FastAPI', 'Python'), E('Supabase', 'SQL'),
    E('This Portfolio', 'Digby'), E('This Portfolio', 'Vercel'),
    E('Git', 'LearnAI'), E('Git', 'Digby'),
    E('Planno', 'Flask'), E('Planno', 'JavaScript'), E('Planno', 'Gemini API'), E('Planno', 'AI / ML'), E('Planno', 'Planno Build Log'), E('Planno', 'Vercel'),
    E('Buzzy the AI', 'Python'), E('Buzzy the AI', 'Electron'), E('Buzzy the AI', 'Llama 3'), E('Buzzy the AI', 'LLMs'), E('Buzzy the AI', 'Building Buzzy'), E('Buzzy the AI', 'Ollama'),
    E('Product Scraper', 'Python'), E('Product Scraper', 'Selenium'),
    E('This Portfolio', 'Three.js'), E('This Portfolio', 'RAG'), E('This Portfolio', 'Knowledge Graphs'), E('This Portfolio', 'Living Knowledge Base'), E('This Portfolio', 'Buzzy the AI'), E('This Portfolio', 'Honey and Ink'),
    E('Building Buzzy', 'LLMs'), E('Building Buzzy', 'RAG'), E('Building Buzzy', 'Embeddings'),
    E('Basketball to Shipping', 'Club Basketball Pres.'), E('Basketball to Shipping', 'Practice Player'), E('Basketball to Shipping', 'Leadership'),
    E('Living Knowledge Base', 'Knowledge Graphs'), E('Living Knowledge Base', 'RAG'),
    E('Planno Build Log', 'Flask'), E('Planno Build Log', 'React'),
    E('Honey and Ink', 'Living Knowledge Base'),
    E('AI / ML', 'LLMs'), E('AI / ML', 'Python'),
    E('LLMs', 'RAG'), E('RAG', 'Knowledge Graphs'), E('RAG', 'Embeddings'),
    E('Ollama', 'Llama 3'), E('Llama 3', 'LLMs'), E('Gemini API', 'LLMs'),
    E('Monmouth CS', "Dean's List x4"), E('Monmouth CS', 'Club Basketball Pres.'), E('Monmouth CS', 'Practice Player'), E('Monmouth CS', 'AI / ML'), E('Monmouth CS', 'SQL'),
    E('Club Basketball Pres.', 'Leadership'), E('Practice Player', 'Leadership'), E('Camp Coach', 'Leadership'), E('Danfords', 'Leadership'),
    E('React', 'JavaScript'), E('Flask', 'Python'),
    E('Git', 'This Portfolio'), E('Git', 'Planno'), E('Git', 'Buzzy the AI'),
  ].filter(Boolean) as [number, number][]
);
