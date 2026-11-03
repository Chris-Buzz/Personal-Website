import { describe, expect, it } from 'vitest';
import { CONTEXT, MORE, NOW, PRINCIPLES, PROJECTS } from './content';
import { REPLIES } from './guide';
import { nodes as hiveNodes } from './hive';
import { MAP_LINKS, MAP_NOTES, ORIGIN } from './siteMap';
import { retrieve } from '../lib/digby';

const ids = new Set(MAP_NOTES.map((n) => n.id));

describe('map', () => {
  it('has a node for every note the guide can retrieve', () => {
    for (const n of hiveNodes) expect(ids.has(n.label), n.label).toBe(true);
  });

  it('has a node for every piece of smaller work', () => {
    for (const m of MORE) expect(ids.has(m.title), m.title).toBe(true);
  });

  it('links only nodes that exist, each pair once', () => {
    const seen = new Set<string>();
    for (const l of MAP_LINKS) {
      expect(ids.has(l.source) && ids.has(l.target), `${l.source} - ${l.target}`).toBe(true);
      const key = [l.source, l.target].sort().join('|');
      expect(seen.has(key), key).toBe(false);
      seen.add(key);
    }
  });

  it('is one connected piece reachable from Chris', () => {
    const next = new Map<string, string[]>();
    for (const { source: a, target: b } of MAP_LINKS) {
      next.set(a, [...(next.get(a) ?? []), b]);
      next.set(b, [...(next.get(b) ?? []), a]);
    }
    const reached = new Set([ORIGIN]);
    const queue = [ORIGIN];
    while (queue.length) for (const m of next.get(queue.pop()!) ?? []) if (!reached.has(m)) reached.add(m), queue.push(m);
    expect([...ids].filter((id) => !reached.has(id))).toEqual([]);
  });

  it('fires nodes that exist for what the guide retrieves', () => {
    for (const q of ['What is Common Memory?', 'What did Chris do at IBM?', 'What is Buzz Off?']) {
      const r = retrieve(q);
      expect(r.ids.length, q).toBeGreaterThan(0);
      for (const id of r.ids) expect(ids.has(id), `${q} -> ${id}`).toBe(true);
    }
  });
});

describe('site copy', () => {
  const copy = JSON.stringify({ PROJECTS, NOW, CONTEXT, PRINCIPLES, MORE, REPLIES, hive: hiveNodes, map: MAP_NOTES });

  it('calls the memory project Common Memory, never by the vault name', () => {
    expect(copy).not.toMatch(/\bBrain\b/);
  });

  it('says nothing the site leaves off', () => {
    expect(copy).not.toMatch(/Overlook|Tally|part-time|return offer|golf center/i);
    const gts = MAP_NOTES.find((n) => n.id === 'GTS')!;
    expect(gts.desc).toMatch(/AI Research Intern/);
    expect(gts.desc).toMatch(/No details of that work are public/);
  });

  it('points every picture at a file that exists', () => {
    // Vite lists the files a glob matches without loading them.
    const files = new Set(Object.keys(import.meta.glob('../../public/projects/**/*.{webp,jpg,png}')).map((f) => f.replace('../../public', '')));
    for (const p of PROJECTS) for (const g of p.gallery ?? []) expect(files.has(g.src), g.src).toBe(true);
  });
});
