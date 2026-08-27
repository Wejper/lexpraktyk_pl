// Jedyne źródło prawdy o końcowym slashu.
//
// Konwencja mieszana: **zbiory mają końcowy slash, dokumenty nie**.
//   /artykuly/rekojmia-mieszkania      — artykuł (bez slasha)
//   /nieruchomosci/                     — kategoria (ze slashem)
//   /kancelarie/dodaj                   — podstrona katalogu (dokument, bez slasha)
//   /tag/umowa                          — tag (bez slasha)
//
// `trailingSlash` w Astro jest globalnie 'never'; wyjątek dla zbiorów wymusza
// wrapper w server-start.mjs, który widzi każde żądanie (cały ruch HTML idzie
// przez Node). Lista zbiorów MUSI być zsynchronizowana z COLLECTIONS
// w server-start.mjs. Wdrożone 1:1 z ogrzeje.pl (README tam, sekcja
// „Konwencja adresów — mieszana").

/** Ścieżki zbiorów — kanonicznie ZE slashem. Sync z server-start.mjs! */
export const COLLECTION_PATHS = [
  '/nieruchomosci',
  '/biznes',
  '/reputacja',
  '/kancelarie',
  '/wzory',
] as const;

/** Kanoniczna postać ścieżki: zbiory ze slashem, reszta bez. */
export function canonicalPath(pathname: string): string {
  if (!pathname.startsWith('/')) return pathname;
  const stripped = pathname.replace(/\/+$/, '') || '/';
  if ((COLLECTION_PATHS as readonly string[]).includes(stripped)) return `${stripped}/`;
  return stripped;
}
