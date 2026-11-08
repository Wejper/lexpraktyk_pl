---
name: weryfikacja-zmian
description: Lista kontrolna przed wypchnięciem na produkcję zmian w kodzie lexpraktyk.pl — layout, menu, kategorie, URL-e, przekierowania, canonical, meta/OG, dane strukturalne, graf linków. Zawiera reguły SEO technicznego z audytu 2026-09-10. Użyj przed commitem/pushem dotykającym BaseLayout.astro, categories.ts, urls.ts, taxonomy.ts, linkGraph.ts, astro.config.mjs, server-start.mjs, oraz przy audycie SEO.
---

# Weryfikacja zmian przed produkcją

Push do `main` = produkcja. Te pliki sterują czymś, czego nie widać w zmienianym kodzie —
weryfikacja musi objąć **wyrenderowaną stronę**, nie tylko kody odpowiedzi.

| Plik | Steruje |
|---|---|
| `src/utils/categories.ts` | kolejnością menu (klucze `CATEGORIES`, potem Wzory pism i Kancelarie), siatką kategorii na home, remisami w `primaryCategory()`, tytułami i opisami kategorii |
| `src/utils/urls.ts` | canonicalami, 301, listą zbiorów (sync z `server-start.mjs`) |
| `src/layouts/BaseLayout.astro` | meta, OG i `ld+json` **wszystkich** stron |
| `src/utils/linkGraph.ts`, `taxonomy.ts` | blokami powiązanych i listingami kategorii |

## Minimum

1. `npm run build` i uruchomienie `dist/` **przez wrapper** (`node server-start.mjs`) — bez niego
   zbiory zwracają 301 i wygląda to na usterkę.
2. **Obejrzyj menu**: Nieruchomości · Biznes · Reputacja · Wzory pism · Kancelarie. (Na ogrzeje.pl
   2026-09-10 zmiana w `CATEGORIES` przestawiła flagową sekcję i poszła na produkcję, bo sprawdzano tylko 200.)
3. `npm run tax:audit` i `npm run links:audit` — zielone.
4. Zmiana w `BaseLayout`: `<title>`, `description`, `og:image`, `ld+json` na **artykule, kategorii i home**.
5. Sprawdzenie formy linków (nie powinno nic wypisać):
   ```sh
   # dokumenty ze slashem (błąd):
   grep -rn 'href="/\(artykuly\|tag\|kancelarie\)/[a-z][^"]*/"' src/ --include='*.astro'
   grep -rn '](/[a-z][^)]*/)' src/content/articles/*.mdx | grep -v -E '\](/(nieruchomosci|biznes|reputacja|kancelarie|wzory)/\)'
   # zbiory bez slasha (błąd):
   grep -rn 'href="/\(nieruchomosci\|biznes\|reputacja\|kancelarie\|wzory\)"' src/ --include='*.astro'
   ```
6. Zmieniony lub usunięty publiczny adres → 301 w `astro.config.mjs`, cel w formie kanonicznej.

## Reguły SEO technicznego (audyt 2026-09-10)

Każda z tych rzeczy była zepsuta i niewidoczna na stronie. Wspólne z ogrzeje.pl — przy zmianie
w jednym serwisie sprawdź drugi (`../ogrzeje_pl/.claude/skills/weryfikacja-zmian`).

- **Mierz wszystkie typy stron:** home, kategorie, `/wzory/`, katalog kancelarii, formularz zgłoszenia, artykuły.
- **Mierz renderowany HTML, nie frontmatter** (layout może doklejać sufiks).
  - `<title>` ≤ 60 znaków; sufiks „ – lexpraktyk.pl” tylko na home i listingach
    (doklejany do artykułów wywalał 38 z 39 tytułów ponad limit).
  - `description` 120–160 znaków.
- **Tytuł kategorii = `CATEGORIES[].seoTitle`** (fraza), `label` krótki dla menu.
- **Dane strukturalne:** artykuły `Article`, `BreadcrumbList`, `FAQPage` (z sekcji „Najczęstsze pytania”,
  format = kontrakt); każda strona `Organization`.
- **`og:image`:** absolutny, wyłącznie okładka z naszego magazynu (nigdy picsum); bez okładki tag nie powstaje.
  OG pisany wprost w `BaseLayout`, nie przez `astro-seo`. Artykuły: `og:type="article"`,
  `article:published_time`, `article:author`.
- **Linki do kategorii przez `categoryUrl()`** — ręczny `/${slug}` wracał już dwa razy (404, breadcrumb).
- **Obrazy:** nad zgięciem `fetchpriority="high"`, w listingach `loading="lazy"` + `decoding="async"`;
  wszystkie `width="800" height="450"`.
- **Fonty** Google Fonts nieblokująco: `media="print"` + `onload`, pełny `<link>` w `<noscript>`.
- **Poza kodem:** po przepisaniu URL-i lub dużej przeróbce artykułu — ręczne zgłoszenie do indeksacji w GSC.
