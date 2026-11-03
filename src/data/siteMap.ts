// The map at /map: a graph built only from what this site already says. Every node is derived from content.ts
// or from the guide's public notes in hive.ts, so the map can never show more than the pages do.
//
// Node ids for the guide's notes are their hive labels, so the labels `retrieve` returns can be fired on the
// map as they are.
import { MORE, PRINCIPLES, PROJECTS, type MoreKind } from './content';
import { edges as hiveEdges, nodes as hiveNodes } from './hive';

export type MapGroup = 'core' | 'projects' | 'parts' | 'habits' | 'built' | 'tools' | 'work';
export type MapShape = 'circle' | 'ring' | 'square' | 'diamond' | 'triangle';

/** Legend order, in the site's own palette: white, greys and its one orange. The projects carry the orange, the
 *  skills a lighter peach of it, and the other groups are white or grey and told apart by shape (circle, ring,
 *  diamond, triangle, square), so colour is never the only cue. */
export const MAP_GROUPS: { id: MapGroup; label: string; shape: MapShape; color: string }[] = [
  { id: 'projects', label: 'Projects', shape: 'circle', color: '#ff7a1a' },
  { id: 'parts', label: 'How they work', shape: 'circle', color: '#d4d4d4' },
  { id: 'habits', label: 'How I work', shape: 'ring', color: '#ffffff' },
  { id: 'built', label: 'Skills I built', shape: 'diamond', color: '#ffb27a' },
  { id: 'tools', label: 'Tools and methods', shape: 'triangle', color: '#8a8a8a' },
  { id: 'work', label: 'Work and school', shape: 'square', color: '#f2f2f2' },
];

export interface MapNote {
  id: string;
  title: string;
  group: MapGroup;
  /** One or two sentences shown on the node's card, taken from the same data as the pages. */
  desc: string;
  /** The page the node belongs to. */
  to: string;
  /** Hubs keep their label on screen. */
  hub: boolean;
  /** For a part of a project: that project's title, so lists can group parts under it. */
  of?: string;
}

export interface MapLink {
  source: string;
  target: string;
}

export const ORIGIN = 'chris';

const plain = (h: string) => h.replace(/\.$/, '');

// Pages for the guide's notes that are not projects or tools.
const HIVE_PLACES: Record<string, { group: MapGroup; to: string; hub?: boolean; of?: string; title?: string }> = {
  IBM: { group: 'work', to: '/about', hub: true },
  GTS: { group: 'work', to: '/about' },
  Monmouth: { group: 'work', to: '/about', title: 'Monmouth University' },
  'LearnAI paper': { group: 'work', to: '/work/learnai' },
  'Recall evaluation': { group: 'parts', to: '/work/common-memory', of: 'Common Memory' },
  'Local AI': { group: 'tools', to: '/work/common-memory' },
  'Digby history': { group: 'projects', to: '/work/common-memory', title: 'Digby (shelved)' },
};

// Where each kind of smaller work hangs on the map.
const MORE_PLACE: Record<MoreKind, { group: MapGroup; anchor: string; to: string }> = {
  Project: { group: 'projects', anchor: ORIGIN, to: '/work' },
  'At IBM': { group: 'work', anchor: 'IBM', to: '/about' },
  'Skill or tool': { group: 'built', anchor: ORIGIN, to: '/work' },
};

function build() {
  const notes = new Map<string, MapNote>();
  const pairs: [string, string][] = [];
  const add = (n: MapNote) => {
    if (!notes.has(n.id)) notes.set(n.id, n);
  };
  const link = (a: string, b: string) => pairs.push([a, b]);
  const habitKeys = new Set(PRINCIPLES.map((h) => h.key));
  // A tag that names one of the habits links to that habit instead of making a twin.
  const tagId = (tag: string) => (habitKeys.has(tag) ? `habit/${tag}` : tag);
  const users = (tag: string) => [...PROJECTS.filter((p) => p.tags.includes(tag)), ...MORE.filter((m) => m.tags.includes(tag))].map((x) => x.title);
  const addTool = (tag: string, to: string) => {
    if (habitKeys.has(tag)) return;
    add({ id: tag, title: tag, group: 'tools', desc: `Used in ${users(tag).join(', ')}.`, to, hub: false });
  };

  add({ id: ORIGIN, title: 'Chris', group: 'core', desc: 'Solo developer and computer science student at Monmouth University.', to: '/about', hub: true });

  for (const p of PROJECTS) {
    const to = `/work/${p.slug}`;
    add({ id: p.title, title: p.title, group: 'projects', desc: p.summary, to, hub: true });
    link(ORIGIN, p.title);
    for (const s of [...p.how, ...p.decisions]) {
      const id = `${p.slug}/${plain(s.h)}`;
      add({ id, title: plain(s.h), group: 'parts', desc: s.p, to, hub: false, of: p.title });
      link(p.title, id);
    }
    for (const tag of p.tags) {
      addTool(tag, to);
      link(p.title, tagId(tag));
    }
  }

  for (const h of PRINCIPLES) {
    const id = `habit/${h.key}`;
    add({ id, title: h.key, group: 'habits', desc: `${h.h} ${h.why}`, to: '/', hub: false });
    link(ORIGIN, id);
    // Each proof names where it comes from (IBM, Common Memory, LearnAI, Planno), which is also that node's id.
    for (const proof of h.proof) link(id, proof.src);
  }

  // Smaller work, hung on Chris or on IBM, and joined to the tools it shares with everything else.
  for (const m of MORE) {
    const place = MORE_PLACE[m.kind];
    const to = m.link && 'to' in m.link ? m.link.to : place.to;
    add({ id: m.title, title: m.title, group: place.group, desc: m.line, to, hub: false });
    link(place.anchor, m.title);
    for (const tag of m.tags) {
      addTool(tag, to);
      link(m.title, tagId(tag));
    }
  }
  // /my-design asks ChatGPT for its concept art through the bridge.
  link('/my-design', 'ChatGPT bridge');

  // The guide's own notes. Projects, smaller work and tools above already carry the same labels, so only the
  // rest are added.
  for (const n of hiveNodes) {
    if (notes.has(n.label)) continue;
    const place = HIVE_PLACES[n.label];
    add({
      id: n.label,
      title: place?.title ?? n.label,
      group: place?.group ?? 'tools',
      desc: n.desc,
      to: place?.to ?? '/work',
      hub: !!place?.hub,
      of: place?.of,
    });
  }
  for (const [a, b] of hiveEdges) link(hiveNodes[a].label, hiveNodes[b].label);
  for (const role of ['IBM', 'GTS', 'Monmouth']) link(ORIGIN, role);

  // Tools with the guide's fuller line read better (React, Expo).
  for (const n of notes.values()) {
    const d = n.group === 'tools' ? hiveNodes.find((h) => h.label === n.id)?.desc : undefined;
    if (d) n.desc = d;
  }

  const ids = new Set(notes.keys());
  const seen = new Set<string>();
  const links: MapLink[] = [];
  for (const [a, b] of pairs) {
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (a === b || !ids.has(a) || !ids.has(b) || seen.has(key)) continue;
    seen.add(key);
    links.push({ source: a, target: b });
  }
  return { notes: [...notes.values()], links };
}

const built = build();

/** Every node on the map, in the order the lists below the map show them. */
export const MAP_NOTES: MapNote[] = built.notes;
export const MAP_LINKS: MapLink[] = built.links;

export const mapNote = (id: string) => MAP_NOTES.find((n) => n.id === id);
export const groupOf = (g: MapGroup) => MAP_GROUPS.find((x) => x.id === g);
