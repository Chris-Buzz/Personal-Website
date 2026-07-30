// Digby's server-half: Vercel serverless function that streams Gemini
// completions grounded in Hive context retrieved client-side. The API key
// lives only in env vars (GEMINI_API_KEY) — never in the repo.
// Shared logic lives in api/_core.ts (also used by the vite dev middleware).

import { sanitize, geminiRequest, pump } from './_core';

interface Req {
  method?: string;
  body?: unknown;
}
interface Res {
  status: (n: number) => Res;
  json: (o: object) => void;
  setHeader: (k: string, v: string) => void;
  write: (s: string) => void;
  end: () => void;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'no-key' });

  const payload = sanitize(req.body);
  if (!payload) return res.status(400).json({ error: 'bad-query' });

  const { url, init } = geminiRequest(payload, key, process.env.GEMINI_MODEL);
  const upstream = await fetch(url, init);
  if (!upstream.ok || !upstream.body) {
    return res.status(502).json({ error: 'upstream', status: upstream.status });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  await pump(upstream.body, (chunk) => res.write(chunk));
  res.end();
}
