import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { sanitize, geminiRequest, pump } from './api/_core';

/**
 * Dev mirror of api/digby.ts so `npm run dev` gets the live Digby brain.
 * Reads GEMINI_API_KEY from .env (gitignored). In production Vercel runs
 * api/digby.ts instead — both share api/_core.ts, so behavior matches.
 */
function digbyDevApi(env: Record<string, string>): Plugin {
  return {
    name: 'digby-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/digby', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('{"error":"POST only"}');
          return;
        }
        let raw = '';
        req.on('data', (c: Buffer) => (raw += c.toString()));
        req.on('end', () => {
          void (async () => {
            try {
              const key = env.GEMINI_API_KEY;
              if (!key) {
                res.statusCode = 503;
                res.end('{"error":"no-key"}');
                return;
              }
              const payload = sanitize(JSON.parse(raw || '{}'));
              if (!payload) {
                res.statusCode = 400;
                res.end('{"error":"bad-query"}');
                return;
              }
              const { url, init } = geminiRequest(payload, key, env.GEMINI_MODEL);
              const upstream = await fetch(url, init);
              if (!upstream.ok || !upstream.body) {
                console.error(`[digby-dev] upstream ${upstream.status}`);
                res.statusCode = 502;
                res.end('{"error":"upstream"}');
                return;
              }
              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Cache-Control', 'no-cache, no-transform');
              await pump(upstream.body, (chunk) => res.write(chunk));
              res.end();
            } catch (e) {
              console.error('[digby-dev]', e);
              if (!res.headersSent) res.statusCode = 500;
              res.end();
            }
          })();
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), digbyDevApi(env)],
    server: { port: 5173, open: true },
  };
});
