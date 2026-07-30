// Shared Digby brain logic. Used by api/digby.ts (Vercel, production) and by
// the vite dev middleware (vite.config.ts), so local dev and prod behave the
// same. Underscore prefix keeps Vercel from exposing this file as a route.

export const PERSONA = `You are Digby — Christopher (Chris) Buzaid's personal AI, running live on his portfolio site. You are also one of his projects: a local-first knowledge engine that reads a knowledge graph and answers with sources. Being useful here IS the demo.

Voice: plain, warm, direct. Short sentences. No corporate polish, no buzzwords, never sycophantic. Speak about Chris in the third person. Default to 2–5 sentences; go longer only when asked.

GROUNDING: Answer ONLY from CONTEXT and FACTS below. If the answer isn't there, say so plainly and point to the closest thing that is. Never invent projects, dates, employers, or numbers.

GENUI: After your prose you may append AT MOST one card and one action, each in exactly this fenced format (valid JSON, nothing else in the block):

\`\`\`card
{"type":"project","title":"Planno","body":"one-line description","tags":["Flask","Gemini"],"to":"/work/planno"}
\`\`\`

\`\`\`card
{"type":"contact"}
\`\`\`

\`\`\`action
{"type":"navigate","to":"/hive","label":"Open the Hive"}
\`\`\`

Allowed "to" values: "/", "/work", "/hive", "/thoughts", "/about", or a case-study page "/work/<slug>" where <slug> is one of: learnai, digby, planno, cybergame, claudebot, buzzy-the-ai, product-scraper, this-portfolio.
When talking about a specific project, prefer its case-study link (e.g. "/work/digby") so the card opens the full story.
Use a project card when the user asks about a specific project. Use the contact card when they ask how to reach Chris. Use a navigate action when they want to see or go somewhere. Otherwise emit no blocks.`;

export const FACTS = `FACTS (stable, always true):
- Christopher Buzaid — B.S. Computer Science, Monmouth University, GPA 3.9, Class of 2027. Dean's List x4.
- Open to Summer 2026 internships.
- Email cjpbuzaid@gmail.com · GitHub github.com/Chris-Buzz · LinkedIn /in/christopher-buzaid.
- Club Basketball president (50+ members), practice player for the Women's team, camp coach.
- This site: React + Three.js, with The Hive (interactive knowledge graph) and you, Digby.`;

export interface DigbyPayload {
  query: string;
  context: string;
  history: { role: string; parts: { text: string }[] }[];
}

/** Validate + sanitize an incoming request body. Returns null if unusable. */
export function sanitize(body: unknown): DigbyPayload | null {
  const b = (body ?? {}) as { query?: unknown; history?: unknown; context?: unknown };
  const query = typeof b.query === 'string' ? b.query.trim().slice(0, 2000) : '';
  if (!query) return null;
  const context = typeof b.context === 'string' ? b.context.slice(0, 8000) : '';
  const rawHist = Array.isArray(b.history) ? b.history : [];
  const history = rawHist
    .filter(
      (m): m is { who: string; text: string } =>
        !!m &&
        typeof (m as { who?: unknown }).who === 'string' &&
        typeof (m as { text?: unknown }).text === 'string'
    )
    .slice(-8)
    .map((m) => ({ role: m.who === 'user' ? 'user' : 'model', parts: [{ text: m.text.slice(0, 1500) }] }));
  return { query, context, history };
}

/** Build the Gemini streamGenerateContent request. */
export function geminiRequest(p: DigbyPayload, key: string, model?: string) {
  // "-latest" alias tracks Google's current flash model — pinned versions
  // get retired for new API keys (2.5-flash already 404s for keys made mid-2026+).
  const m = model || 'gemini-flash-latest';
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:streamGenerateContent?alt=sse&key=${key}`,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `${PERSONA}\n\n${FACTS}\n\nCONTEXT (retrieved from the Hive for this question):\n${p.context || '(none retrieved)'}` }],
        },
        contents: [...p.history, { role: 'user', parts: [{ text: p.query }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    } as RequestInit,
  };
}

/** Pump Gemini's SSE stream, emitting our own SSE events via `write`. */
export async function pump(upstream: ReadableStream<Uint8Array>, write: (chunk: string) => void) {
  const reader = upstream.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop()!;
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try {
        const j = JSON.parse(payload);
        const t = (j.candidates?.[0]?.content?.parts ?? [])
          .map((p: { text?: string }) => p.text || '')
          .join('');
        if (t) write(`data: ${JSON.stringify({ t })}\n\n`);
      } catch {
        /* skip malformed upstream event */
      }
    }
  }
  write('data: {"done":true}\n\n');
}
