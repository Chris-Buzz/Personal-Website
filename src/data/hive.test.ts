import { describe, it, expect } from 'vitest';
import { nodes, edges } from './hive';
import { PROJECTS } from './content';


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

  // Every project node must be a real project page, and every project must be known to the guide.
  it('project nodes and Work page projects match one to one', () => {
    const titles = PROJECTS.map((p) => p.title).sort();
    const projectNodes = nodes.filter((n) => n.type === 'project').map((n) => n.label).sort();
    expect(projectNodes).toEqual(titles);
  });

  it('never mentions material kept off the site', () => {
    nodes.forEach((n) => expect(`${n.label} ${n.desc}`, `"${n.label}"`).not.toMatch(/part-time|Overlook|Tally/i));
  });

  it('no orphan project nodes (every project connects to something)', () => {
    const connected = new Set(edges.flat());
    nodes.forEach((n, i) => {
      if (n.type === 'project') expect(connected.has(i), `project "${n.label}" has no edges`).toBe(true);
    });
  });
});
