# lexpraktyk.pl — reguły dla Claude

Praktyczny portal prawny (Nieruchomości / Biznes / Reputacja) — Astro 6 + MDX, Turso
(wspólna baza z ogrzeje.pl, tabela `kancelarie`), deploy GitHub Actions → seohost.
Strategia, monetyzacja, stan: `README.md`. Backlog i priorytety tematów: `ARTICLES.md`.

Skille projektu (`.claude/skills/`) — wczytaj, gdy zadanie pasuje:
- `artykul` — pisanie, poprawianie, tytuły, podstawy prawne, frontmatter, dobór tematu
- `weryfikacja-zmian` — zanim zmiana w layoucie, kategoriach, URL-ach lub SEO pójdzie na `main`

Bliźniaczy serwis: `../ogrzeje_pl` (ten sam szkielet). Reguły SEO technicznego są wspólne —
poprawka w jednym serwisie = sprawdź drugi.

## Komendy

```sh
npm run dev          # http://localhost:4321
npm run build
npm run tax:audit    # tagi/kategorie — musi być zielony
npm run links:audit  # graf linków; 4 slugi z kupionymi linkami wpisane w package.json
```

Push do `main` = deploy na produkcję. Codzienny build 05:00 UTC publikuje artykuły z datą przyszłą.

## Reguły, które obowiązują zawsze

**Treść prawna musi mieć podstawę.** Każde twierdzenie prawne opiera się na realnym przepisie
(ustawa z Dz.U., RODO itd.). Nie wymyślaj artykułów, kwot, terminów ani orzeczeń — jeśli nie da się
zweryfikować, oznacz do sprawdzenia przez autora.

**Adresy — konwencja mieszana.** Zbiory ze slashem (`/nieruchomosci/`, `/biznes/`, `/reputacja/`,
`/kancelarie/`, `/wzory/`), dokumenty bez (`/artykuly/x`, `/kancelarie/dodaj`, `/tag/x`).
Forma niekanoniczna = 301.
- Nowy zbiór: dopisz w **dwóch** miejscach — `COLLECTION_PATHS` w `src/utils/urls.ts`
  i `COLLECTIONS` w `server-start.mjs`.
- Linki do kategorii tylko przez `categoryUrl()`, canonical/sitemapa przez `canonicalPath()`.
- **Nigdy nie zmieniaj publicznego adresu bez 301 w `astro.config.mjs`** — stare adresy są zaindeksowane.

**Nigdy nie nadpisuj `.htaccess`** — panel seohost wstrzykuje tam konfigurację Passengera.
Build statyczny leży w `domains/lexpraktyk.pl/client/`, nie w `public_html`.

**Okładki:** kanoniczny zbiór na serwerze (`public_html/images/covers`), w repo gitignored.
Lokalnie spadają na picsum.photos — to normalne, ale picsum nigdy nie trafia do `og:image`.

**Jedno źródło prawdy:**
- kategorie, menu, tagi: wyłącznie `src/utils/categories.ts`
- meta, OG, `ld+json` wszystkich stron: `src/layouts/BaseLayout.astro`

**Kolejność menu to decyzja biznesowa:** Nieruchomości · Biznes · Reputacja · Wzory pism · Kancelarie.

**Linkowanie w przód jest dozwolone** — `src/plugins/remark-defer-unpublished-links.mjs` zdejmuje
link do artykułu z przyszłą datą do dnia jego publikacji.

Po zmianie w `categories.ts`, `urls.ts`, `BaseLayout.astro`, `linkGraph.ts`, `taxonomy.ts`
→ skill `weryfikacja-zmian` przed commitem.
