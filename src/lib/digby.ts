// Digby's client-side brain-half: retrieval over the Hive graph, the streaming
// client for /api/digby, and the GenUI protocol parser. Generation happens
// server-side (api/digby.ts); everything here is free and instant.

import { nodes, edges } from '../data/hive';

/* ── retrieval ─────────────────────────────────────────────────────────── */

export interface Retrieved {
  /** context block sent to the model, one line per node */
  context: string;
  /** labels for the sources line shown under the reply */
  sources: string | null;
}

const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'what', 'whats', 'who', 'how', 'does', 'do', 'did',
  'of', 'to', 'in', 'on', 'and', 'or', 'about', 'tell', 'me', 'his', 'her', 'it', 'for',
  'with', 'can', 'you', 'your', 'chris', 'he', 'him', 'i', 'my',
]);

/** Lexical match over node labels/descriptions, expanded one hop along edges. */
export function retrieve(query: string): Retrieved {
  const toks = query.toLowerCase().split(/[^a-z0-9+#./]+/).filter((w) => w.length > 1 && !STOP.has(w));

  const scored = nodes
    .map((n, i) => {
      const label = n.label.toLowerCase();
      const desc = n.desc.toLowerCase();
      let s = 0;
      for (const w of toks) {
        if (label === w) s += 6;
        else if (label.includes(w)) s += 3;
        if (desc.includes(w)) s += 1;
      }
      return { i, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4);

  const picked = new Set(scored.map((x) => x.i));
  // one hop out: neighbors carry the "everything connects" context
  for (const { i } of scored) {
    for (const [a, b] of edges) {
      const nb = a === i ? b : b === i ? a : -1;
      if (nb >= 0 && picked.size < 8) picked.add(nb);
    }
  }
  // nothing matched → ground on the flagship projects so Digby still knows who Chris is
  if (!picked.size) nodes.forEach((n, i) => { if (n.type === 'project' && picked.size < 5) picked.add(i); });

  return {
    context: [...picked].map((i) => `- ${nodes[i].label} [${nodes[i].type}]: ${nodes[i].desc}`).join('\n'),
    sources: scored.length ? scored.map((x) => nodes[x.i].label).join(' · ') : 'the Hive',
  };
}

/* ── GenUI protocol ────────────────────────────────────────────────────── */

export const DIGBY_ROUTES = new Set(['/', '/work', '/hive', '/thoughts', '/about']);
/** Routes Digby may link to: the five pages, /work/<slug> case studies, and
 *  legacy /work?p=<slug> deep links. Anything else gets dropped. */
export const isDigbyRoute = (to: string) =>
  DIGBY_ROUTES.has(to) || /^\/work\/[a-z0-9-]+$/.test(to) || /^\/work\?p=[a-z0-9-]+$/.test(to);

export interface DigbyCard {
  type: 'project' | 'contact' | 'node';
  title?: string;
  body?: string;
  tags?: string[];
  to?: string;
}
export interface DigbyAction {
  type: 'navigate';
  to: string;
  label?: string;
}
export type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'card'; card: DigbyCard }
  | { kind: 'action'; action: DigbyAction };

/**
 * Split a reply into prose / card / action segments. Malformed blocks are
 * dropped; an unterminated fence (mid-stream) is hidden until it closes.
 */
export function parseSegments(raw: string): Segment[] {
  const out: Segment[] = [];
  const re = /```(card|action)\s*\n([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const before = raw.slice(last, m.index).trim();
    if (before) out.push({ kind: 'text', text: before });
    last = re.lastIndex;
    try {
      const j = JSON.parse(m[2]);
      if (m[1] === 'card' && (j.type === 'project' || j.type === 'contact' || j.type === 'node')) {
        out.push({ kind: 'card', card: j });
      } else if (m[1] === 'action' && j.type === 'navigate' && isDigbyRoute(j.to)) {
        out.push({ kind: 'action', action: j });
      }
    } catch {
      /* malformed model output → drop the block, keep the prose */
    }
  }
  const tail = raw.slice(last);
  const open = tail.indexOf('```');
  const text = (open >= 0 ? tail.slice(0, open) : tail).trim();
  if (text) out.push({ kind: 'text', text });
  return out;
}

/* ── streaming client ──────────────────────────────────────────────────── */

/**
 * Stream a reply from the serverless function. Calls onDelta with the full
 * text so far on every token. Throws if the API is unreachable (vite dev
 * without `vercel dev`, missing key) — caller falls back to scripted mode.
 */
export async function streamDigby(
  query: string,
  history: { who: 'bot' | 'user'; text: string }[],
  ret: Retrieved,
  onDelta: (full: string) => void
): Promise<void> {
  const res = await fetch('/api/digby', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, history, context: ret.context }),
  });
  if (!res.ok || !res.body) throw new Error(`digby ${res.status}`);
  if (!(res.headers.get('content-type') || '').includes('text/event-stream')) throw new Error('not-sse');

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let full = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const events = buf.split('\n\n');
    buf = events.pop()!;
    for (const ev of events) {
      const line = ev.split('\n').find((l) => l.startsWith('data:'));
      if (!line) continue;
      try {
        const j = JSON.parse(line.slice(5));
        if (j.t) {
          full += j.t;
          onDelta(full);
        }
      } catch {
        /* skip malformed event */
      }
    }
  }
  if (!full) throw new Error('empty');
}
