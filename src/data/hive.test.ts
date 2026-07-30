import { describe, it, expect } from 'vitest';
import { nodes, edges } from './hive';
import { PROJECTS } from './content';

// Same transform HeroCinematic uses to turn a node label into a /work?p= slug.
const slugOf = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

describe('hive graph integrity', () => {
  it('every edge references a real node', () => {
    edges.forEach(([a, b]) => {
      expect(a, `edge [${a},${b}] start out of range`).toBeGreaterThanOrEqual(0);
      expect(a, `edge [${a},${b}] start out of range`).toBeLessThan(nodes.length);
      expect(b, `edge [${a},${b}] end out of range`).toBeGreaterThanOrEqual(0);
      expect(b, `edge [${a},${b}] end out of range`).toBeLessThan(nodes.length);
    });
  });

  it('has no self-edges', () => {
    edges.forEach(([a, b]) => expect(a, `self-edge on "${nodes[a]?.label}"`).not.toBe(b));
  });

  it('node labels are unique', () => {
    const labels = nodes.map((n) => n.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('every node has a description', () => {
    nodes.forEach((n) => expect(n.desc.length, `"${n.label}" missing desc`).toBeGreaterThan(10));
  });

  // The home constellation's clickable chips navigate to /work?p=<slugified label>.
  // If a project node exists in the Hive, the Work page must have a matching row.
  it('every hive project node maps to a Work page project slug', () => {
    const workSlugs = new Set(PROJECTS.map((p) => p.slug));
    nodes
      .filter((n) => n.type === 'project')
      .forEach((n) => {
        expect(workSlugs.has(slugOf(n.label)), `hive project "${n.label}" (slug "${slugOf(n.label)}") has no Work page row — chips would deep-link to nothing`).toBe(true);
      });
  });

  it('no orphan project nodes (every project connects to something)', () => {
    const connected = new Set(edges.flat());
    nodes.forEach((n, i) => {
      if (n.type === 'project') expect(connected.has(i), `project "${n.label}" has no edges`).toBe(true);
    });
  });
});
