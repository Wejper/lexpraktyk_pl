import { readFileSync } from 'fs';

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
import('./entry.mjs');
