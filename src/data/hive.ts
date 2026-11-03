// The guide's public knowledge: one node per project plus the facts it may cite.
// Edges link related nodes so retrieval can pull in neighbours.
import { PROJECTS, EXPERIENCE, PAPER, RECALL, MORE } from './content';

export type NodeType = 'project' | 'work' | 'post' | 'skill' | 'life';
export interface HiveNode {
  label: string;
  type: NodeType;
  desc: string;
}

const projectNodes: HiveNode[] = PROJECTS.map((p) => ({
  label: p.title,
  type: 'project',
  desc: [p.summary, ...p.problem, ...p.how.map((s) => `${s.h}: ${s.p}`), `Status: ${p.status.label}.`].join(' '),
}));

// Smaller projects, work at IBM, and the skills and tools Chris built, from the Work page.
const moreNodes: HiveNode[] = MORE.map((m) => ({
  label: m.title,
  type: m.kind === 'Skill or tool' ? 'skill' : 'work',
  desc: `${m.line} ${m.kind}, ${m.year}. Built with ${m.tags.join(', ')}. Status: ${m.status.label}.`,
}));

export const nodes: HiveNode[] = [
  ...projectNodes,
  ...moreNodes,
  {
    label: 'LearnAI paper',
    type: 'post',
    desc: `${PAPER.authors}. ${PAPER.title}. ${PAPER.venue}, ${PAPER.id}, ${PAPER.href}. The program and its results belong to the whole team.`,
  },
  {
    label: 'Recall evaluation',
    type: 'skill',
    desc: `Common Memory is measured with ${RECALL.questions} real questions and ${RECALL.unrelated} unrelated prompts. Hybrid recall went from ${RECALL.before} to ${RECALL.after} hit in the top 4 after adding date and tool awareness (${RECALL.measured}). Graph expansion scored lower and was left out.`,
  },
  { label: 'Local AI', type: 'skill', desc: 'Common Memory embeds and answers with models running in Ollama on Chris’s PC. Planno can use Apple’s on-device model.' },
  { label: 'React', type: 'skill', desc: 'Used for this portfolio and the LearnAI booking site.' },
  { label: 'Expo', type: 'skill', desc: 'Used for the Buzz Off and Planno iPhone apps.' },
  {
    label: 'IBM',
    type: 'life',
    desc: `${EXPERIENCE[0].role}, ${EXPERIENCE[0].place}, ${EXPERIENCE[0].date}. ${EXPERIENCE[0].points.join(' ')}`,
  },
  {
    label: 'GTS',
    type: 'life',
    desc: 'AI Research Intern at General Technical Services (GTS), Wall Township, NJ, January to May 2026. No details of that work are public.',
  },
  {
    label: 'Monmouth',
    type: 'life',
    desc: 'Computer science senior at Monmouth University, graduating December 2026, GPA 3.9 out of 4.0, Dean’s List every semester from Fall 2023 to Spring 2026. AI Research Assistant on LearnAI since October 2025.',
  },
  {
    label: 'Digby history',
    type: 'life',
    desc: 'Digby was a broader personal-assistant project that Chris shelved on November 1, 2026. Its memory work became Common Memory. This guide is not connected to his private vault.',
  },
];

const at = (label: string) => {
  const i = nodes.findIndex((n) => n.label === label);
  if (i < 0) throw new Error(`hive: no node "${label}"`);
  return i;
};

export const edges: [number, number][] = [
  [at('Common Memory'), at('Recall evaluation')],
  [at('Common Memory'), at('Local AI')],
  [at('Common Memory'), at('Digby history')],
  [at('LearnAI'), at('LearnAI paper')],
  [at('LearnAI'), at('React')],
  [at('LearnAI'), at('Monmouth')],
  [at('Buzz Off'), at('Expo')],
  [at('Buzz Off'), at('Monmouth')],
  [at('Planno'), at('Expo')],
  [at('Planno'), at('Local AI')],
  [at('IBM'), at('Local AI')],
  [at('GTS'), at('IBM')],
];
