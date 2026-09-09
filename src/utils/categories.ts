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
      'spadek', 'zachowek', 'testament', 'dział spadku', 'podatek', 'zakup mieszkania',
      'wady mieszkania', 'rękojmia', 'najem', 'zasiedzenie', 'agent nieruchomości',
      'odbiór mieszkania', 'rynek wtórny', 'umowa przedwstępna', 'umowa z wykonawcą',
      'odrzucenie spadku', 'stwierdzenie nabycia spadku', 'urząd skarbowy', 'remont', 'budowa',
      'eksmisja', 'lokal socjalny'],
    core: ['nieruchomości', 'spadek', 'dziedziczenie', 'zachowek', 'testament', 'zakup mieszkania',
      'deweloper', 'księga wieczysta', 'najem', 'zasiedzenie', 'eksmisja'],
  },
  biznes: {
    label: 'Biznes',
    num: 'II',
    tagline: 'Standardowa umowa B2B pisana jest przez prawnika drugiej strony. Sprawdź, zanim podpiszesz.',
    description: 'Abuzywne klauzule, windykacja B2B, zakaz konkurencji, spory ze wspólnikiem — ochrona prawna gdy Twoje pieniądze są zagrożone.',
    tags: ['biznes', 'windykacja', 'umowa', 'klauzule abuzywne', 'spółka', 'due diligence',
      'franczyza', 'leasing', 'zakaz konkurencji', 'wypowiedzenie', 'praca', 'B2B',
      'umowa B2B', 'umowa o pracę', 'kontrahent', 'długi', 'konsument', 'zwolnienie'],
    core: ['biznes', 'B2B', 'umowa B2B', 'windykacja', 'spółka', 'praca', 'umowa o pracę',
      'kontrahent'],
  },
  reputacja: {
    label: 'Reputacja',
    num: 'III',
    tagline: 'Pomawianie, fałszywe opinie, szantaż 1★. Co — i kiedy — da się z tym zrobić bez awantury.',
    description: 'Fałszywe opinie, szantaż reputacyjny, pomówienie, RODO — chronimy Twoje dobre imię i reputację firmy gdy stawka jest wysoka.',
    tags: ['reputacja', 'pomówienie', 'dobra osobiste', 'RODO', 'opinie', 'ochrona marki',
      'dobre imię', 'Google', 'szantaż', 'opinie w internecie', 'ochrona wizerunku',
      'ochrona danych', 'anonimowość', 'Facebook', 'lekarz', 'dentysta'],
    core: ['reputacja', 'pomówienie', 'dobra osobiste', 'opinie', 'opinie w internecie',
      'ochrona wizerunku', 'szantaż'],
  },
} as const;

/** Tagi celowo przekrojowe: opisują procedurę, nie temat, więc jako kryterium kategorii
 *  tylko by szkodziły. Wypisane wprost, żeby audyt nie zgłaszał ich jako nieznanych. */
export const BROAD_TAGS = ['pozew', 'odszkodowanie', 'zabezpieczenie'] as const;

export type CategorySlug = keyof typeof CATEGORIES;

/** Kategorie, do których artykuł w ogóle pasuje. Do rozstrzygnięcia jednej —
 *  primaryCategory() z utils/taxonomy.ts. */
export function categoriesFor(tags: readonly string[] = []): CategorySlug[] {
  return (Object.keys(CATEGORIES) as CategorySlug[]).filter((slug) =>
    tags.some((t) => (CATEGORIES[slug].tags as readonly string[]).includes(t))
  );
}
