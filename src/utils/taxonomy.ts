// Wagi tagów i rozstrzyganie kategorii głównej.
//
// Dwa problemy rozwiązane w jednym miejscu, bo oba sprowadzają się do pytania
// „jak bardzo ten tag coś znaczy":
//
//  1. Kategorie się kanibalizowały — artykuł pasujący do kilku trafiał do każdej
//     z nich, więc listingi pokazywały w kółko te same teksty.
//  2. Dobór powiązanych artykułów traktował wspólny tag ogólny na równi z precyzyjnym,
//     a przy `poradnik` na 38 z 62 artykułów to znaczyło: prawie wszystko jest
//     „powiązane" z prawie wszystkim.
//
// Waga tagu = odwrotna częstość dokumentowa (IDF). Tag na połowie serwisu waży
// grosze, tag na trzech artykułach waży dużo — bo to on niesie informację o temacie.
//
// Bliźniaczy plik żyje w drugim repo; przy zmianach trzymać oba zgodne.

import { CATEGORIES, categoriesFor, type CategorySlug } from './categories';

type Taggable = { data: { tags?: readonly string[] } };

/** Wagi IDF dla wszystkich tagów w kolekcji. Liczyć raz, przekazywać dalej. */
export function tagWeights(articles: readonly Taggable[]): Map<string, number> {
  const df = new Map<string, number>();
  for (const a of articles) {
    for (const t of new Set(a.data.tags ?? [])) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const N = Math.max(articles.length, 1);
  // +1 w liczniku i mianowniku: tag obecny wszędzie dostaje wagę bliską zeru,
  // ale nie dokładnie zero — inaczej artykuł otagowany wyłącznie ogólnikami
  // przestałby być podobny do czegokolwiek.
  return new Map([...df].map(([t, n]) => [t, Math.log((N + 1) / (n + 1)) + 0.05]));
}

/** Ile trafień w tagi definiujące kategorię waży więcej niż jakikolwiek zysk z IDF.
 *  Dzięki temu rzadki tag poboczny nie przeciąga artykułu do cudzej kategorii,
 *  a przy równej liczbie trafień definiujących o wyniku dalej decyduje IDF. */
const CORE_BONUS = 100;

/** Dopasowanie artykułu do kategorii: najpierw tagi definiujące, potem waga IDF. */
function score(tags: readonly string[], slug: CategorySlug, w: Map<string, number>): number {
  const { tags: all, core } = CATEGORIES[slug];
  const coreHits = tags.filter((t) => (core as readonly string[]).includes(t)).length;
  const idf = tags
    .filter((t) => (all as readonly string[]).includes(t))
    .reduce((s, t) => s + (w.get(t) ?? 0), 0);
  return coreHits * CORE_BONUS + idf;
}

/**
 * Jedna kategoria na artykuł — ta, której tagi niosą najwięcej informacji.
 * Remisy rozstrzyga kolejność w CATEGORIES, żeby wynik był powtarzalny między buildami.
 * `null` znaczy, że artykuł nie pasuje nigdzie — audyt taksonomii to wyłapie.
 */
export function primaryCategory(
  article: Taggable,
  weights: Map<string, number>
): CategorySlug | null {
  const tags = article.data.tags ?? [];
  const candidates = categoriesFor(tags);
  if (candidates.length <= 1) return candidates[0] ?? null;

  let best: CategorySlug = candidates[0];
  let bestScore = -Infinity;
  for (const slug of candidates) {
    const s = score(tags, slug, weights);
    if (s > bestScore) [best, bestScore] = [slug, s];
  }
  return best;
}

/** Artykuły należące do kategorii — rozłącznie, po jednej kategorii na artykuł. */
export function articlesInCategory<T extends Taggable>(
  articles: readonly T[],
  slug: CategorySlug
): T[] {
  const weights = tagWeights(articles);
  return articles.filter((a) => primaryCategory(a, weights) === slug);
}
