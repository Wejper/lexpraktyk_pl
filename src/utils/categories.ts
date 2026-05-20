export const CATEGORIES = {
  dziedziczenie: {
    label: 'Dziedziczenie',
    description: 'Spadki, zachowek, dział spadku, testament — praktyczny przewodnik krok po kroku.',
    tags: ['dziedziczenie', 'spadek', 'zachowek', 'testament', 'dział spadku'],
  },
  nieruchomosci: {
    label: 'Nieruchomości',
    description: 'Kupno, sprzedaż i prawo nieruchomości — notariat, księgi wieczyste, koszty transakcji.',
    tags: ['nieruchomości', 'notariusz', 'księga wieczysta', 'umowa', 'hipoteka'],
  },
  dobre_imie: {
    label: 'Dobre imię',
    description: 'Ochrona reputacji, pomówienia w internecie, dobra osobiste — jak reagować i dochodzić praw.',
    tags: ['dobre imię', 'pomówienie', 'dobra osobiste', 'reputacja', 'RODO'],
  },
  prawo_rodzinne: {
    label: 'Prawo rodzinne',
    description: 'Rozwód, podział majątku, alimenty, intercyza — prawa i procedury.',
    tags: ['rozwód', 'alimenty', 'podział majątku', 'intercyza', 'prawo rodzinne'],
  },
  poradniki: {
    label: 'Poradniki',
    description: 'Praktyczne przewodniki prawne dla zwykłych ludzi — bez żargonu, krok po kroku.',
    tags: ['poradnik', 'procedura', 'kalkulator', 'wzór pisma', 'sąd'],
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
