// Dane strukturalne (schema.org) budowane z tego, co artykuł już zawiera.
//
// Nic tu nie wymaga dopisywania pól do frontmattera — FAQ czytamy z treści, breadcrumb
// z kategorii, autora i daty z metadanych. Dzięki temu schema nie rozjeżdża się z tekstem:
// zmiana pytania w artykule zmienia je też w danych strukturalnych.

const SITE = 'https://lexpraktyk.pl';

export const absolute = (path: string) =>
  path.startsWith('http') ? path : `${SITE}${path.startsWith('/') ? path : `/${path}`}`;

/** Wydawca — powtarzany w każdym Article, więc trzymany w jednym miejscu. */
const publisher = {
  '@type': 'Organization',
  name: 'lexpraktyk.pl',
  url: SITE,
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'lexpraktyk.pl',
    url: SITE,
    description: 'Praktyczny portal prawny: nieruchomości, biznes i ochrona reputacji.',
  };
}

type ArticleInput = {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  publishDate: Date;
};

export function articleSchema({ title, description, url, image, author, publishDate }: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(url) },
    datePublished: publishDate.toISOString().slice(0, 10),
    // Bez osobnego pola w schemacie treści nie mamy daty modyfikacji — podawanie tu
    // daty builda byłoby nieprawdą odświeżaną codziennie, więc jej nie ma.
    author: { '@type': 'Person', name: author ?? 'Redakcja lexpraktyk.pl' },
    publisher,
    ...(image ? { image: absolute(image) } : {}),
    inLanguage: 'pl-PL',
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.url),
    })),
  };
}

/**
 * Pytania i odpowiedzi wyciągnięte z sekcji „Najczęstsze pytania".
 *
 * Format w treści jest stały: nagłówek H2, a pod nim pary `**pytanie**` + akapit odpowiedzi.
 * Parsujemy surowy MDX, a nie wyrenderowany HTML, bo w tym miejscu potrzebny jest czysty
 * tekst — Google odrzuca FAQPage z zagnieżdżonym formatowaniem.
 */
export function faqFromBody(body: string): { question: string; answer: string }[] {
  const section = body.split(/^## Najczęstsze pytania\s*$/m)[1];
  if (!section) return [];

  // Sekcja kończy się kolejnym H2 albo poziomą linią przed „Podstawą prawną".
  const untilNextHeading = section.split(/^(?:## |---\s*$)/m)[0];

  const out: { question: string; answer: string }[] = [];
  const re = /^\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n*$)/gm;
  for (const m of untilNextHeading.matchAll(re)) {
    const question = m[1].trim();
    const answer = m[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // linki → sam tekst
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (question && answer) out.push({ question, answer });
  }
  return out;
}

export function faqSchema(entries: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: e.answer },
    })),
  };
}
