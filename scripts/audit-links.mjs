#!/usr/bin/env node
// Audyt grafu linków wewnętrznych.
//
// Dwie warstwy, mierzone osobno, bo psują się niezależnie:
//
//   • blok powiązanych — generowany przez utils/linkGraph.ts, więc tu sprawdzamy
//     rozkład: czy nikt nie jest wyspą i czy jeden artykuł nie zajmuje slotu wszędzie;
//   • linki kontekstowe w treści — pisane ręcznie, mocniejszy sygnał, żaden automat ich
//     nie doda. Ich brak jest niewidoczny na stronie, bo blok powiązanych wygląda tak samo.
//
// Uruchomienie: npm run links:audit [slug…] — podane slugi dostają osobną sekcję,
// bo strony z kupionymi linkami mają rozprowadzać moc, a nie ją zatrzymywać.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ARTICLES_DIR = 'src/content/articles';
const watched = process.argv.slice(2);

// linkGraph.ts jest TypeScriptem, a audyt ma działać bez buildu — reguła jest krótka,
// więc odtwarzamy ją tutaj. Rozjazd wyłapie test: obie strony liczą IDF tak samo.
const articles = readdirSync(ARTICLES_DIR)
  .filter((f) => /\.mdx?$/.test(f))
  .map((file) => {
    const raw = readFileSync(join(ARTICLES_DIR, file), 'utf-8');
    const fm = raw.split('---')[1] ?? '';
    const body = raw.split('---').slice(2).join('---');
    const m = fm.match(/tags:\s*\[([^\]]*)\]/);
    return {
      id: file.replace(/\.mdx?$/, ''),
      tags: m ? m[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean) : [],
      // linki kontekstowe: tylko te w treści, nie w komponentach
      links: [...body.matchAll(/\]\(\/artykuly\/([^)#\s]+)\)/g)].map((x) => x[1]),
    };
  });

const N = articles.length;
const ids = new Set(articles.map((a) => a.id));

// --- linki kontekstowe -------------------------------------------------------
const withLinks = articles.filter((a) => a.links.length > 0);
const contextualIn = new Map(articles.map((a) => [a.id, 0]));
const broken = [];
for (const a of articles) {
  for (const l of a.links) {
    if (ids.has(l)) contextualIn.set(l, contextualIn.get(l) + 1);
    else broken.push(`${a.id} → /artykuly/${l}`);
  }
}

// --- rozkład bloku powiązanych ----------------------------------------------
const df = new Map();
for (const a of articles) for (const t of new Set(a.tags)) df.set(t, (df.get(t) ?? 0) + 1);
const weight = (t) => Math.log((N + 1) / ((df.get(t) ?? 0) + 1)) + 0.05;

const OUT_DEGREE = 3;
const pairs = [];
for (const a of articles) {
  for (const b of articles) {
    if (a.id === b.id || !a.tags.length || !b.tags.length) continue;
    const shared = a.tags.filter((t) => b.tags.includes(t));
    if (!shared.length) continue;
    const score = shared.reduce((s, t) => s + weight(t), 0) / Math.sqrt(a.tags.length * b.tags.length);
    pairs.push({ from: a.id, to: b.id, score });
  }
}
pairs.sort((x, y) => y.score - x.score || x.from.localeCompare(y.from) || x.to.localeCompare(y.to));

const out = new Map(articles.map((a) => [a.id, []]));
const inbound = new Map(articles.map((a) => [a.id, 0]));
const eligible = (p) => out.get(p.from).length < OUT_DEGREE && !out.get(p.from).includes(p.to);
const take = (p) => { out.get(p.from).push(p.to); inbound.set(p.to, inbound.get(p.to) + 1); };
for (const p of pairs) if (eligible(p) && inbound.get(p.to) < OUT_DEGREE * 2) take(p);
for (const p of pairs) if (eligible(p)) take(p);
// przebieg domykający pokrycie — jak w utils/linkGraph.ts
for (const orphan of articles.filter((a) => inbound.get(a.id) === 0)) {
  for (const p of pairs.filter((p) => p.to === orphan.id && !out.get(p.from).includes(orphan.id))) {
    const targets = out.get(p.from);
    if (targets.length < OUT_DEGREE) { take(p); break; }
    const weakest = [...targets].reverse().find((t) => inbound.get(t) > 1);
    if (!weakest) continue;
    targets.splice(targets.indexOf(weakest), 1);
    inbound.set(weakest, inbound.get(weakest) - 1);
    take(p);
    break;
  }
}

const degrees = [...inbound.values()].sort((a, b) => a - b);
const median = degrees[Math.floor(degrees.length / 2)];
const orphans = [...inbound].filter(([, n]) => n === 0).map(([id]) => id);
const deadEnds = [...out].filter(([, t]) => t.length === 0).map(([id]) => id);
const hogs = [...inbound].filter(([, n]) => n > OUT_DEGREE * 2).sort((a, b) => b[1] - a[1]);

// --- raport ------------------------------------------------------------------
console.log(`\nGRAF LINKÓW — ${N} artykułów`);
console.log('='.repeat(78));

console.log('\n■ Blok powiązanych (generowany)');
console.log(`  linki przychodzące: min ${degrees[0]} · mediana ${median} · maks ${degrees.at(-1)}`);
console.log(`  wyspy (0 przychodzących): ${orphans.length}${orphans.length ? ' — ' + orphans.join(', ') : ''}`);
console.log(`  ślepe zaułki (0 wychodzących): ${deadEnds.length}${deadEnds.length ? ' — ' + deadEnds.join(', ') : ''}`);
console.log(`  ponad limit ${OUT_DEGREE * 2}: ${hogs.length}${hogs.length ? ' — ' + hogs.map(([i, n]) => `${i} (${n})`).join(', ') : ''}`);

console.log('\n■ Linki kontekstowe w treści (ręczne)');
console.log(`  artykuły, które linkują: ${withLinks.length} z ${N}`);
console.log(`  łącznie linków: ${articles.reduce((s, a) => s + a.links.length, 0)}`);
if (broken.length) console.log(`  ✗ prowadzą donikąd: ${broken.join(', ')}`);

if (watched.length) {
  console.log('\n■ Strony pod obserwacją (cele kupionych linków)');
  for (const id of watched) {
    const a = articles.find((x) => x.id === id);
    if (!a) { console.log(`  ${id} — NIE ISTNIEJE`); continue; }
    console.log(`  ${id}`);
    console.log(`      kontekstowe: ${a.links.length} wych. / ${contextualIn.get(id)} przych.` +
      `   blok: ${out.get(id).length} wych. / ${inbound.get(id)} przych. (mediana ${median})`);
  }
}

const problems = orphans.length + deadEnds.length + broken.length;
console.log(`\n${problems === 0 ? '✓ Graf spójny.' : `✗ Do naprawy: ${problems} pozycji.`}\n`);
process.exit(problems === 0 ? 0 : 1);
