import { describe, it, expect } from 'vitest';
import { REPLIES, replyTo, FALLBACK, GUIDE_SUGGESTIONS } from './guide';
import { parseSegments } from '../lib/digby';
import { PROJECTS } from './content';

describe('saved replies', () => {
  it('matches every project by name', () => {
    PROJECTS.forEach((p) => expect(replyTo(`Tell me about ${p.title}`).src).toBe(p.title));
  });

  it('answers each suggested question without falling back', () => {
    GUIDE_SUGGESTIONS.forEach((q) => expect(replyTo(q), q).not.toBe(FALLBACK));
  });

  it('explains Digby as the project Brain came from', () => {
    expect(replyTo('tell me about digby').src).toContain('Digby');
  });

  it('falls back for unmatched queries', () => {
    expect(replyTo('quantum blockchain llama farming')).toBe(FALLBACK);
  });

  it('never mentions material kept off the site', () => {
    REPLIES.forEach((r) => expect(r.t).not.toMatch(/part-time|Overlook|Tally/i));
  });

  // Cards and actions are embedded in reply text as fenced JSON. If one is
  // malformed it silently disappears in the UI, so fail loudly here instead.
  it('every embedded card or action parses', () => {
    REPLIES.forEach((r) => {
      const fences = (r.t.match(/```(card|action)/g) || []).length;
      const parsed = parseSegments(r.t).filter((s) => s.kind !== 'text').length;
      expect(parsed, `reply [${r.k?.[0]}] has ${fences} fenced block(s) but only ${parsed} parsed`).toBe(fences);
    });
  });
});

describe('GTS', () => {
  it('appears only as the AI Research Intern role, with no description of the work', () => {
    const r = replyTo('What did Chris do at GTS?');
    expect(r.t).toContain('AI Research Intern');
    expect(r.t).toContain('not public');
  });
});
