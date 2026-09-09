#!/usr/bin/env node
// Audyt taksonomii: czy tagi i kategorie faktycznie porządkują treść.
//
// Kategoria przypisuje artykuł przez przecięcie jego tagów ze słownikiem
// CATEGORIES[…].tags, więc rozjazd między słownikiem a frontmatterem jest
// niewidoczny na oko, a psuje listingi i dobór powiązanych artykułów.
// Skrypt czyta te same źródła co strony — src/utils/categories.ts i frontmatter —
// i podaje liczby zamiast wrażeń. Bliźniaczy plik żyje w drugim repo; trzymać zgodne.
//
// Uruchomienie: npm run tax:audit

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLES_DIR = 'src/content/articles';
const CATEGORIES_FILE = 'src/utils/categories.ts';

/** Tagi kategorii ze słownika. Parsowane regexem — categories.ts to TypeScript,
 *  którego zwykły node nie zaimportuje, a dokładanie buildu dla audytu to przesada. */
function readCategories() {
  const src = readFileSync(CATEGORIES_FILE, 'utf-8');
  const body = src.slice(src.indexOf('CATEGORIES = {'));
  const out = new Map();
  for (const m of body.matchAll(/^  '?([\w-]+)'?:\s*\{([\s\S]*?)^  \},?$/gm)) {
    const [, slug, block] = m;
    const tags = block.match(/tags:\s*\[([^\]]*)\]/);
    const core = block.match(/core:\s*\[([^\]]*)\]/);
    out.set(slug, {
      tags: tags ? tags[1].split(',').map(unquote).filter(Boolean) : [],
      core: core ? core[1].split(',').map(unquote).filter(Boolean) : [],
    });
  }
  return out;
}

const unquote = (s) => s.trim().replace(/^['"]|['"]$/g, '');

/** Wszystkie stringi z nazwanej struktury w categories.ts (FUEL_TAGS, BROAD_TAGS). */
function readList(name) {
  const src = readFileSync(CATEGORIES_FILE, 'utf-8');
  const at = src.indexOf(name + ' ');
  if (at === -1) return [];
  const block = src.slice(at, src.indexOf('\n\n', at));
  return [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

function readArticles() {
  return readdirSync(ARTICLES_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((file) => {
      const raw = readFileSync(join(ARTICLES_DIR, file), 'utf-8');
      const fm = raw.split('---')[1] ?? '';
      const m = fm.match(/tags:\s*\[([^\]]*)\]/);
      const tags = m ? m[1].split(',').map(unquote).filter(Boolean) : [];
      return { file, slug: file.replace(/\.mdx?$/, ''), tags };
    });
}

const categories = readCategories();
const articles = readArticles();
const N = articles.length;

// --- rozkład tagów -----------------------------------------------------------
const useCount = new Map();
for (const a of articles) for (const t of a.tags) useCount.set(t, (useCount.get(t) ?? 0) + 1);
const byUse = [...useCount].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

// Tag obecny na połowie serwisu nie rozróżnia niczego — ani w listingu, ani przy
// doborze powiązanych. Próg 1/3 kolekcji wskazuje kandydatów do wycofania.
const TOO_BROAD = Math.ceil(N / 3);
const tooBroad = byUse.filter(([, n]) => n >= TOO_BROAD);
const singleUse = byUse.filter(([, n]) => n === 1);

// Tag nieznany to taki, który nie kwalifikuje do kategorii, nie zbiera artykułów na
// podstronie paliwa i nie jest zadeklarowany jako celowo szeroki — czyli nie robi nic.
const vocabulary = new Set([...categories.values()].flatMap((c) => c.tags).concat(readList('FUEL_TAGS'), readList('BROAD_TAGS')));
const offVocabulary = byUse.filter(([t]) => !vocabulary.has(t));

// Warianty zapisu tej samej rzeczy: osobne tagi, osobne cienkie strony /tag/.
const byNormal = new Map();
for (const [t, n] of byUse) {
  const key = t.toLowerCase().replace(/\s+/g, ' ').trim();
  byNormal.set(key, [...(byNormal.get(key) ?? []), [t, n]]);
}
const dupes = [...byNormal.values()].filter((v) => v.length > 1);

// --- przypisanie do kategorii ------------------------------------------------
const hits = articles.map((a) => ({
  ...a,
  cats: [...categories].filter(([, c]) => a.tags.some((t) => c.tags.includes(t))).map(([s]) => s),
}));
const uncategorised = hits.filter((a) => a.cats.length === 0);
const multiCategorised = hits.filter((a) => a.cats.length > 1);

// Kategoria główna — ta sama reguła co primaryCategory() w src/utils/taxonomy.ts:
// najpierw trafienia w tagi definiujące, przy remisie waga IDF.
const weight = (t) => Math.log((N + 1) / ((useCount.get(t) ?? 0) + 1)) + 0.05;
const primaryOf = (a) =>
  a.cats.length <= 1
    ? a.cats[0] ?? null
    : a.cats
        .map((c) => [
          c,
          a.tags.filter((t) => categories.get(c).core.includes(t)).length * 100 +
            a.tags.filter((t) => categories.get(c).tags.includes(t)).reduce((s, t) => s + weight(t), 0),
        ])
        .reduce((best, cur) => (cur[1] > best[1] ? cur : best))[0];

const perCategory = new Map([...categories.keys()].map((s) => [s, 0]));
for (const a of hits) {
  const p = primaryOf(a);
  if (p) perCategory.set(p, perCategory.get(p) + 1);
}

// --- raport ------------------------------------------------------------------
const pct = (n) => `${n} z ${N} (${Math.round((n / N) * 100)}%)`;
const list = (xs) => xs.map(([t, n]) => `${t} (${n})`).join(', ');

console.log(`\nTAKSONOMIA — ${N} artykułów, ${useCount.size} unikalnych tagów, ${categories.size} kategorii`);
console.log('='.repeat(78));

console.log(`\nTagi na artykuł: śr. ${(articles.reduce((s, a) => s + a.tags.length, 0) / N).toFixed(1)}` +
  `, bez tagów: ${articles.filter((a) => !a.tags.length).length}`);

console.log(`\n■ Tagi zbyt szerokie (≥ ${TOO_BROAD} artykułów — nie rozróżniają): ${tooBroad.length}`);
if (tooBroad.length) console.log('  ' + list(tooBroad));

console.log(`\n■ Tagi jednorazowe (cienkie strony /tag/): ${singleUse.length}`);
if (singleUse.length) console.log('  ' + singleUse.map(([t]) => t).join(', '));

console.log(`\n■ Tagi nieznane — poza kategoriami, fasetami i listą szerokich: ${offVocabulary.length} z ${useCount.size}`);
if (offVocabulary.length) console.log('  ' + list(offVocabulary));

console.log(`\n■ Warianty zapisu tego samego tagu: ${dupes.length}`);
for (const v of dupes) console.log('  ' + list(v));

console.log(`\n■ Artykuły bez żadnej kategorii (niewidoczne w listingach): ${uncategorised.length}`);
for (const a of uncategorised) console.log(`  ${a.slug} — tagi: ${a.tags.join(', ') || 'brak'}`);

// Nie usterka: primaryCategory() rozstrzyga to przy budowaniu listingów. Liczba mówi,
// jak bardzo słownik jest rozmyty — im wyższa, tym więcej zależy od rozstrzygania wag.
console.log(`\n■ Pasuje do kilku kategorii (rozstrzygane wagą IDF): ${pct(multiCategorised.length)}`);
for (const a of multiCategorised.slice(0, 8)) console.log(`  ${a.slug} → ${a.cats.join(', ')} ⇒ ${primaryOf(a)}`);
if (multiCategorised.length > 8) console.log(`  …i ${multiCategorised.length - 8} więcej`);

console.log('\n■ Artykułów na kategorię (rozłącznie, po kategorii głównej):');
for (const [slug, n] of perCategory) console.log(`  ${slug.padEnd(16)} ${n}`);

const problems = uncategorised.length + dupes.length + offVocabulary.length;
console.log(`\n${problems === 0 ? '✓ Bez zastrzeżeń.' : `✗ Do naprawy: ${problems} pozycji.`}\n`);
process.exit(problems === 0 ? 0 : 1);
