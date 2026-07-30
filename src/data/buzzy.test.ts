import { describe, it, expect } from 'vitest';
import { BZ, replyTo, BZ_FALLBACK } from './buzzy';
import { parseSegments } from '../lib/digby';

describe('scripted replies', () => {
  it('matches the new projects', () => {
    expect(replyTo('What is LearnAI?').src).toContain('LearnAI');
    expect(replyTo('tell me about digby').src).toContain('Digby');
    expect(replyTo('what about the cybergame thing?').src).toContain('CyberGame');
  });

  it('falls back for unmatched queries', () => {
    expect(replyTo('quantum blockchain llama farming')).toBe(BZ_FALLBACK);
  });

  // Cards/actions are embedded in reply text as fenced JSON — if one is
  // malformed it silently disappears in the UI. Fail loudly here instead.
  it('every embedded GenUI block in scripted replies parses', () => {
    BZ.forEach((r) => {
      const fences = (r.t.match(/```(card|action)/g) || []).length;
      const parsed = parseSegments(r.t).filter((s) => s.kind !== 'text').length;
      expect(parsed, `reply [${r.k?.[0]}] has ${fences} fenced block(s) but only ${parsed} parsed`).toBe(fences);
    });
  });
});
