import { readFileSync } from 'fs';
import http from 'node:http';

try {
  const env = readFileSync('/home/srv35677/domains/lexpraktyk.pl/.env', 'utf-8');
  for (const line of env.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
} catch {}

process.env.HOST = '0.0.0.0';
process.env.PORT = process.env.PORT || '4321';
process.env.ASTRO_NODE_AUTOSTART = 'disabled';

// Collections are canonical WITH the trailing slash; every other page without.
// Astro's trailingSlash is global ('never'), so the exception lives here, in
// front of the handler: the slashless form 301s to the slash form, and the
// slash form is rewritten internally so Astro serves it as if slashless.
// MUST stay in sync with COLLECTION_PATHS in src/utils/urls.ts.
const COLLECTIONS = new Set([
  '/nieruchomosci',
  '/biznes',
  '/reputacja',
  '/kancelarie',
  '/wzory',
]);

const { handler } = await import('./entry.mjs');

http
  .createServer((req, res) => {
    const q = req.url.indexOf('?');
    const pathname = q === -1 ? req.url : req.url.slice(0, q);
    const query = q === -1 ? '' : req.url.slice(q);
    if (COLLECTIONS.has(pathname)) {
      res.statusCode = 301;
      res.setHeader('Location', pathname + '/' + query);
      res.end();
      return;
    }
    if (pathname.endsWith('/') && COLLECTIONS.has(pathname.slice(0, -1))) {
      req.url = pathname.slice(0, -1) + query;
    }
    handler(req, res);
  })
  .listen(Number(process.env.PORT), process.env.HOST);
