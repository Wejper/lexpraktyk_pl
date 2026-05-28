export const CATEGORIES = {
  nieruchomosci: {
    label: 'Nieruchomości',
    num: 'I',
    tagline: 'Największa transakcja w życiu. Konsultacja prawna zamiast 3% prowizji agenta.',
    description: 'Zakup bez agenta, spory z deweloperem, dziedziczenie nieruchomości, księgi wieczyste — zanim podpiszesz, wiedz co podpisujesz.',
    tags: ['nieruchomości', 'notariusz', 'księga wieczysta', 'hipoteka', 'deweloper', 'dziedziczenie', 'spadek', 'zachowek', 'testament', 'dział spadku', 'podatek', 'zakup mieszkania', 'wady mieszkania', 'rękojmia'],
  },
  biznes: {
    label: 'Biznes',
    num: 'II',
    tagline: 'Standardowa umowa B2B pisana jest przez prawnika drugiej strony. Sprawdź, zanim podpiszesz.',
    description: 'Abuzywne klauzule, windykacja B2B, zakaz konkurencji, spory ze wspólnikiem — ochrona prawna gdy Twoje pieniądze są zagrożone.',
    tags: ['biznes', 'windykacja', 'umowa', 'klauzule abuzywne', 'spółka', 'due diligence', 'franczyza', 'leasing', 'zakaz konkurencji', 'wypowiedzenie', 'praca', 'B2B'],
  },
  reputacja: {
    label: 'Reputacja',
    num: 'III',
    tagline: 'Pomawianie, fałszywe opinie, szantaż 1★. Co — i kiedy — da się z tym zrobić bez awantury.',
    description: 'Fałszywe opinie, szantaż reputacyjny, pomówienie, RODO — chronimy Twoje dobre imię i reputację firmy gdy stawka jest wysoka.',
    tags: ['reputacja', 'pomówienie', 'dobra osobiste', 'RODO', 'opinie', 'ochrona marki', 'dobre imię', 'Google', 'szantaż'],
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
