import { describe, it, expect } from 'vitest';
import { retrieve, parseSegments, isDigbyRoute } from './digby';

describe('retrieve', () => {
  it('finds Planno for a planno question and cites it', () => {
    const r = retrieve('What is Planno?');
    expect(r.sources).toContain('Planno');
    expect(r.context).toContain('Planno');
  });

  it('expands one hop along edges (asking about Digby pulls in related tech)', () => {
    const r = retrieve('Tell me about Digby');
    expect(r.context.split('\n').length).toBeGreaterThan(2);
  });

  it('falls back to project grounding for unmatched queries', () => {
    const r = retrieve('zzz qqq xyzzy');
    expect(r.sources).toBe('the Hive');
    expect(r.context.length).toBeGreaterThan(0);
  });
});

describe('parseSegments (GenUI protocol)', () => {
  it('splits prose + card + action', () => {
    const raw = 'Here you go.\n```card\n{"type":"project","title":"Planno","to":"/work?p=planno"}\n```\n```action\n{"type":"navigate","to":"/hive","label":"Go"}\n```';
    const segs = parseSegments(raw);
    expect(segs.map((s) => s.kind)).toEqual(['text', 'card', 'action']);
  });

  it('drops malformed JSON blocks but keeps the prose', () => {
    const segs = parseSegments('Hello.\n```card\n{not json}\n```');
    expect(segs).toEqual([{ kind: 'text', text: 'Hello.' }]);
  });

  it('hides an unterminated fence while streaming', () => {
    const segs = parseSegments('Answer text.\n```card\n{"type":"pro');
    expect(segs).toEqual([{ kind: 'text', text: 'Answer text.' }]);
  });

  it('rejects actions to non-whitelisted routes', () => {
    const segs = parseSegments('x\n```action\n{"type":"navigate","to":"https://evil.example"}\n```');
    expect(segs.some((s) => s.kind === 'action')).toBe(false);
  });
});

describe('isDigbyRoute', () => {
  it('accepts pages and /work deep links, rejects everything else', () => {
    expect(isDigbyRoute('/work')).toBe(true);
    expect(isDigbyRoute('/work?p=learnai')).toBe(true);
    expect(isDigbyRoute('/work?p=Bad Slug')).toBe(false);
    expect(isDigbyRoute('https://evil.example')).toBe(false);
    expect(isDigbyRoute('/admin')).toBe(false);
  });
});
