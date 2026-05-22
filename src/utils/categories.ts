export const CATEGORIES = {
  nieruchomosci: {
    label: 'Nieruchomości',
    description: 'Zakup bez agenta, spory z deweloperem, dziedziczenie nieruchomości, księgi wieczyste — zanim podpiszesz, wiedz co podpisujesz.',
    tags: ['nieruchomości', 'notariusz', 'księga wieczysta', 'hipoteka', 'deweloper', 'dziedziczenie', 'spadek', 'zachowek', 'testament', 'dział spadku', 'podatek', 'zakup mieszkania', 'wady mieszkania', 'rękojmia'],
  },
  biznes: {
    label: 'Biznes',
    description: 'Abuzywne klauzule, windykacja B2B, zakaz konkurencji, spory ze wspólnikiem — ochrona prawna gdy Twoje pieniądze są zagrożone.',
    tags: ['biznes', 'windykacja', 'umowa', 'klauzule abuzywne', 'spółka', 'due diligence', 'franczyza', 'leasing', 'zakaz konkurencji', 'wypowiedzenie', 'praca', 'B2B'],
  },
  reputacja: {
    label: 'Reputacja',
    description: 'Fałszywe opinie, szantaż reputacyjny, pomówienie, RODO — chronimy Twoje dobre imię i reputację firmy gdy stawka jest wysoka.',
    tags: ['reputacja', 'pomówienie', 'dobra osobiste', 'RODO', 'opinie', 'ochrona marki', 'dobre imię', 'Google', 'szantaż'],
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
