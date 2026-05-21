export const CATEGORIES = {
  nieruchomosci: {
    label: 'Nieruchomości',
    description: 'Zakup bez agenta, spory z deweloperem, dziedziczenie nieruchomości, księgi wieczyste — zanim podpiszesz, wiedz co podpisujesz.',
    tags: ['nieruchomości', 'notariusz', 'księga wieczysta', 'hipoteka', 'deweloper', 'dziedziczenie', 'spadek', 'zachowek', 'testament', 'dział spadku', 'podatek'],
  },
  praca: {
    label: 'Praca',
    description: 'Wypowiedzenie, zakaz konkurencji, pułapki w umowach B2B — Twoje prawa jako pracownik i zleceniobiorca.',
    tags: ['praca', 'wypowiedzenie', 'zakaz konkurencji', 'umowa o pracę', 'B2B', 'nadgodziny', 'zwolnienie'],
  },
  biznes: {
    label: 'Biznes',
    description: 'Abuzywne klauzule, windykacja B2B, spory ze wspólnikiem, due diligence — ochrona prawna małej firmy.',
    tags: ['biznes', 'windykacja', 'umowa', 'klauzule abuzywne', 'spółka', 'due diligence', 'franczyza', 'leasing'],
  },
  reputacja: {
    label: 'Reputacja',
    description: 'Fałszywe opinie, pomówienie w internecie, RODO, ochrona marki — usuwamy szkodliwe treści i bronimy Twojego dobrego imienia.',
    tags: ['reputacja', 'pomówienie', 'dobra osobiste', 'RODO', 'opinie', 'ochrona marki', 'dobre imię'],
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
