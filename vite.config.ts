import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { sanitize, geminiRequest, pump } from './api/_core';
import { agentFiles, personJsonLd } from './src/data/agentFiles';

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

/**
 * Files for AI agents (llms.txt, llms-full.txt, site.json), generated from src/data/content.ts so they always match
 * the pages. Served from memory in dev; written into dist/ at build time.
 */
function agentFilesPlugin(): Plugin {
  const types: Record<string, string> = { txt: 'text/markdown; charset=utf-8', json: 'application/json; charset=utf-8' };
  return {
    name: 'agent-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = (req.url ?? '').split('?')[0].replace(/^\//, '');
        const files = agentFiles();
        if (!(name in files)) return next();
        res.setHeader('Content-Type', types[name.split('.').pop()!]);
        res.end(files[name]);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(agentFiles())) this.emitFile({ type: 'asset', fileName, source });
    },
    // Points agents at the files from every page's head, and adds schema.org data about Chris.
    transformIndexHtml() {
      return [
        { tag: 'link', attrs: { rel: 'alternate', type: 'text/markdown', title: 'For AI agents', href: '/llms.txt' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'alternate', type: 'application/json', title: 'Site data', href: '/site.json' }, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(personJsonLd()), injectTo: 'head' },
      ];
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), digbyDevApi(env), agentFilesPlugin()],
    server: { port: 5173, open: true },
  };
});
