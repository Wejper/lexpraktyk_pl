// Jedyne źródło prawdy o tagach i kategoriach.
//
// Zasada doboru tagów kategorii: **tag ma rozróżniać**. `tags` decyduje, czy artykuł
// w ogóle pasuje do kategorii; `core` to podzbiór tagów, które temat *definiują* —
// sama rzadkość tagu nie wystarcza do rozstrzygania, bo przeciągnęłaby tekst tam,
// gdzie trafił się rzadki tag poboczny.
//
// Artykuł zwykle pasuje do kilku kategorii; o przynależności do listingu rozstrzyga
// primaryCategory() z utils/taxonomy.ts, żeby kategorie się nie kanibalizowały.
// Wdrożone 1:1 z ogrzeje.pl.

export const CATEGORIES = {
  nieruchomosci: {
    label: 'Nieruchomości',
    num: 'I',
    tagline: 'Największa transakcja w życiu. Konsultacja prawna zamiast 3% prowizji agenta.',
    description: 'Zakup bez agenta, spory z deweloperem, dziedziczenie nieruchomości, księgi wieczyste — zanim podpiszesz, wiedz co podpisujesz.',
    tags: ['nieruchomości', 'notariusz', 'księga wieczysta', 'hipoteka', 'deweloper', 'dziedziczenie',
      'spadek', 'zachowek', 'testament', 'podatek', 'zakup mieszkania',
      'rękojmia', 'najem', 'zasiedzenie', 'remont', 'eksmisja'],
    core: ['nieruchomości', 'spadek', 'dziedziczenie', 'zachowek', 'testament', 'zakup mieszkania',
      'deweloper', 'księga wieczysta', 'najem', 'zasiedzenie', 'eksmisja'],
  },
  biznes: {
    label: 'Biznes',
    num: 'II',
    tagline: 'Standardowa umowa B2B pisana jest przez prawnika drugiej strony. Sprawdź, zanim podpiszesz.',
    description: 'Abuzywne klauzule, windykacja B2B, zakaz konkurencji, spory ze wspólnikiem — ochrona prawna gdy Twoje pieniądze są zagrożone.',
    tags: ['biznes', 'windykacja', 'umowa', 'klauzule abuzywne', 'spółka', 'due diligence',
      'franczyza', 'leasing', 'zakaz konkurencji', 'wypowiedzenie', 'B2B', 'konsument',
      'umowa o pracę', 'kontrahent'],
    core: ['biznes', 'B2B', 'windykacja', 'spółka', 'umowa o pracę',
      'kontrahent'],
  },
  reputacja: {
    label: 'Reputacja',
    num: 'III',
    tagline: 'Pomawianie, fałszywe opinie, szantaż 1★. Co — i kiedy — da się z tym zrobić bez awantury.',
    description: 'Fałszywe opinie, szantaż reputacyjny, pomówienie, RODO — chronimy Twoje dobre imię i reputację firmy gdy stawka jest wysoka.',
    tags: ['reputacja', 'pomówienie', 'dobra osobiste', 'RODO', 'opinie', 'ochrona marki',
      'dobre imię', 'Google', 'szantaż', 'ochrona wizerunku',
      'lekarz'],
    core: ['reputacja', 'pomówienie', 'dobra osobiste', 'opinie', 'ochrona wizerunku', 'szantaż'],
  },
} as const;

/** Tagi celowo przekrojowe: opisują procedurę, nie temat, więc jako kryterium kategorii
 *  tylko by szkodziły. Wypisane wprost, żeby audyt nie zgłaszał ich jako nieznanych. */
export const BROAD_TAGS = ['pozew', 'odszkodowanie', 'zabezpieczenie'] as const;

/** Tagi scalone 2026-09-10: każdy miał dokładnie jeden artykuł, więc utrzymywał pustą
 *  stronę /tag/ zamiast cokolwiek grupować. Strony tagów są noindex, więc nie chodzi
 *  o pozycje — chodzi o to, żeby link z artykułu nie prowadził w pustkę.
 *  /tag/[tag] przekierowuje po tej mapie. Wdrożone 1:1 z ogrzeje.pl. */
export const MERGED_TAGS: Record<string, string> = {
  'Facebook': 'opinie',
  'opinie w internecie': 'opinie',
  'anonimowość': 'pomówienie',
  'agent nieruchomości': 'zakup mieszkania',
  'rynek wtórny': 'zakup mieszkania',
  'umowa przedwstępna': 'zakup mieszkania',
  'budowa': 'remont',
  'umowa z wykonawcą': 'remont',
  'dentysta': 'lekarz',
  'dział spadku': 'spadek',
  'odrzucenie spadku': 'spadek',
  'stwierdzenie nabycia spadku': 'spadek',
  'długi': 'windykacja',
  'lokal socjalny': 'eksmisja',
  'ochrona danych': 'RODO',
  'odbiór mieszkania': 'deweloper',
  'wady mieszkania': 'deweloper',
  'praca': 'umowa o pracę',
  'zwolnienie': 'wypowiedzenie',
  'umowa B2B': 'B2B',
  'urząd skarbowy': 'podatek',
};

export type CategorySlug = keyof typeof CATEGORIES;

/** Kategorie, do których artykuł w ogóle pasuje. Do rozstrzygnięcia jednej —
 *  primaryCategory() z utils/taxonomy.ts. */
export function categoriesFor(tags: readonly string[] = []): CategorySlug[] {
  return (Object.keys(CATEGORIES) as CategorySlug[]).filter((slug) =>
    tags.some((t) => (CATEGORIES[slug].tags as readonly string[]).includes(t))
  );
}
