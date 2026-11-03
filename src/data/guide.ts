// Saved replies for the portfolio guide, used when the live model is unavailable.
import { MORE, PROJECTS, PROFILE } from './content';

export interface GuideReply {
  k?: string[];
  t: string;
  src: string | null;
}

const card = (o: object) => '\n```card\n' + JSON.stringify(o) + '\n```';
const action = (o: object) => '\n```action\n' + JSON.stringify(o) + '\n```';

export const REPLIES: GuideReply[] = [
  ...PROJECTS.map((p) => ({
    k: [p.slug, p.title.toLowerCase(), ...(p.aliases ?? [])],
    src: p.title,
    t: p.problem.join('\n\n') + card({ type: 'project', title: p.title, body: p.summary, to: `/work/${p.slug}` }),
  })),
  ...MORE.map((m) => ({
    k: [m.id, m.title.toLowerCase()],
    src: m.title,
    t: m.line + action({ type: 'navigate', to: m.kind === 'At IBM' ? '/about' : '/work', label: m.kind === 'At IBM' ? 'Open About' : 'See the work' }),
  })),
  {
    k: ['digby'],
    src: 'Digby history · Common Memory',
    t: 'Digby was a broader personal-assistant project that Chris shelved on November 1, 2026. Its memory work became Common Memory, which he uses every day. This guide reads only public project notes and cannot reach his private vault.',
  },
  {
    k: ['contact', 'email', 'hire', 'reach', 'touch'],
    src: 'Contact',
    t: `Email Chris at ${PROFILE.email}.` + card({ type: 'contact' }),
  },
  {
    k: ['ibm', 'experience', 'internship', 'job', 'work history'],
    src: 'Experience',
    t: 'Chris was a Backend Developer Intern on IBM’s z/OSMF team from May to August 2026. He wrote functional verification tests for the z/OSMF REST APIs, prototyped generative UI with the Vercel AI SDK on local models, helped build a custom mode for Bob, IBM’s AI coding agent, and led a team workshop on using it.' +
      action({ type: 'navigate', to: '/about', label: 'Open About' }),
  },
  {
    k: ['gts', 'general technical'],
    src: 'Experience',
    t: 'Chris was an AI Research Intern at General Technical Services (GTS) in Wall Township, NJ, from January to May 2026. The details of that work are not public.',
  },
  {
    k: ['paper', 'research', 'sigcse'],
    src: 'LearnAI paper',
    t: 'Chris co-authored “LearnAI: Just-in-Time AI Co-Creation Across Disciplines at a University” with Weihao Qu, Ling Zheng and Daniel Crawford, for SIGCSE Virtual 2026. It is on arXiv as 2608.19164.',
  },
  {
    k: ['work', 'projects', 'built', 'portfolio', 'look at first', 'start'],
    src: 'Selected work',
    t: 'Start with Common Memory for evaluation and privacy, LearnAI for the published research, Buzz Off for the senior project, or Planno for on-device AI on an iPhone.' +
      action({ type: 'navigate', to: '/work', label: 'See the work' }),
  },
];

export const GREET: GuideReply = { src: null, t: 'Hi. Ask about Chris’s projects, experience or how to reach him.' };
export const FALLBACK: GuideReply = {
  src: null,
  t: 'The public notes on this site do not answer that. Try a project name, or email Chris.',
};

export function replyTo(query: string): GuideReply {
  const s = query.toLowerCase();
  if (/^(hi|hello|hey)\b/.test(s) && s.length < 25) return GREET;
  return REPLIES.find((r) => r.k?.some((k) => s.includes(k))) ?? FALLBACK;
}

export const GUIDE_SUGGESTIONS = ['How was Common Memory measured?', 'What did Chris do at IBM?', 'How do I reach Chris?'];
