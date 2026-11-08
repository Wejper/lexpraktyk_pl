---
name: artykul
description: Pisanie, poprawianie i planowanie artykułów lexpraktyk.pl (MDX w src/content/articles) — dobór tematu, styl, tytuł i jego antywzorce, podstawy prawne z Dz.U., sekcja FAQ, wymagany frontmatter, persony autorów. Użyj przy każdym nowym wpisie, edycji treści lub tytułu, wyborze tematu z ARTICLES.md albo przeglądzie merytorycznym.
---

# Artykuł na lexpraktyk.pl

Czytelnik stoi przed decyzją prawną wartą dziesiątki tysięcy złotych (nieruchomość, spadek,
pieniądze/reputacja firmy). Cel: **podjąć decyzję i nie stracić pieniędzy** — nie wiedza o prawie.

## Dobór tematu — trzy pytania

1. **Przed jaką decyzją stoi czytelnik?** Co musi za chwilę zrobić lub podpisać.
2. **Ile go kosztuje pomyłka?** „Nic konkretnego” = ciekawostka, nie artykuł dla tego serwisu.
3. **Czy ktoś już to tłumaczy zrozumiale?** Przewagą są kwoty, terminy i konsekwencje wariantów.

Temat spełniający wszystkie trzy pisze się nawet przy zerowych wyświetleniach w GSC.
Priorytety i tiering: `ARTICLES.md`. Przed pisaniem sprawdź kanibalizację:
```sh
grep -h '^title:' src/content/articles/*.mdx
```

## Tytuł

- Fraza, którą ktoś wpisuje w chwili problemu („jak usunąć fałszywą opinię z Google”,
  „klient grozi jedną gwiazdką”). Fraza **na początku**.
- Sprawdź wariant w Search Console: „komu **należy się** zachowek” ~3× więcej wyświetleń niż
  „komu **przysługuje**”.
- **Do ~60 znaków w renderowanym `<title>`** (artykuły bez sufiksu domeny). Rankujące wpisy mają 43–64.
- Po dwukropku obietnica praktyczna: *ile wynosi*, *jak uniknąć*, *czego możesz żądać*.

**Antywzorce** (batch 3 miał ich sześć na dziesięć):
- **Sygnatura przepisu w tytule** — „art. 299 KSH w praktyce” wpisuje tylko prawnik. Przepis do treści.
- **Ogon z listy rzeczowników** — „…: sposoby, koszty i terminy”.
- **Wypełniacze** — „krok po kroku”, „w praktyce”, „kompendium”, „wszystko, co musisz wiedzieć”.
- **Zła kolejność** — „podatek od sprzedaży mieszkania przed upływem 5 lat”, nie „sprzedaż…: podatek”.
- **Trzy człony** — dwa dwukropki/trzy myślniki = dwa tematy, rozdziel na dwa teksty.

## Treść

- **Odpowiedź w pierwszych 2–3 zdaniach** pod H1, gdy tytuł jest pytaniem (featured snippet).
- **Naturalny język** — żadnych „niniejszym”, „w związku z powyższym”, „należy wskazać iż”.
- **Konkretne kroki, kwoty, terminy, opłaty** — nie wykład z prawa.
- **Blockquote (`>`)** dla 2–4 kluczowych wniosków/ostrzeżeń.
- **Długość jest konsekwencją pokrycia tematu, nie dźwignią** (korelacja słów z pozycją: −0,13 tutaj,
  −0,00 na ogrzeje). Frazy niszowe (opinia od pacjenta, szantaż 1★): zwykle 750–1000 słów wystarcza.
  Frazy konkurencyjne (zachowek, eksmisja, testament, spadek): potrzebują szerszego pokrycia —
  warianty sytuacji, przykłady liczbowe, FAQ — co zwykle daje 1200+ słów. Bez lania wody.
- Linkuj w przód swobodnie; link kontekstowy w akapicie jest mocniejszy niż blok powiązanych —
  priorytet: strony z kupionymi linkami (lista w `package.json` → `links:audit`).

## Podstawy prawne — obowiązkowo

Każde twierdzenie prawne ma oparcie w realnym przepisie. Cytuj naturalnie w tekście
(„art. 17 RODO daje Ci 30 dni…”) albo zbierz w sekcji „Podstawa prawna” na końcu.
Przykłady: Kodeks cywilny (Dz.U. 1964 nr 16 poz. 93), Kodeks karny (Dz.U. 1997 nr 88 poz. 553),
RODO (Rozporządzenie UE 2016/679), ustawa o ochronie danych osobowych (Dz.U. 2018 poz. 1000).

**Nie zmyślaj** numerów artykułów, kwot, terminów, stawek opłat ani orzeczeń. Czego nie da się
zweryfikować w źródle — oznacz wyraźnie do sprawdzenia przez autora. Przy kwotach z datą
(opłaty, taksy, progi) podaj stan prawny na dzień pisania.

## Sekcja „Najczęstsze pytania” = `FAQPage`

`utils/schema.ts` parsuje ją z treści — format to kontrakt:

```mdx
## Najczęstsze pytania

**Pytanie?**

Akapit odpowiedzi.
```

Zmiana formatu cicho wyłącza dane strukturalne.

## Frontmatter

Wszystkie 7 pól (tak ma każdy z istniejących artykułów):

```mdx
---
title: "Fraza na początku: obietnica praktyczna"
description: "Opis SEO, 120–155 znaków"
publishDate: 2026-11-20
published: true
tags: ["nieruchomości", "zachowek"]
author: "Katarzyna Wiśniewska"
coverQuery: "notary signing documents"
---
```

Brak `coverQuery` = brak okładki i OG. Tagi tylko ze słownika w `src/utils/categories.ts`.
Data przyszła → wpis wchodzi sam przy buildzie 05:00 UTC; podgląd `/preview/[slug]`.

## Autorzy (persony)

- **Katarzyna Wiśniewska** — prawo cywilne, nieruchomości, ochrona dóbr osobistych
- **Piotr Mazur** — prawo gospodarcze, umowy B2B, zakaz konkurencji
- **Marta Kowalczyk** — RODO, reputacja online, prawo konsumenckie

## Po napisaniu

```sh
npm run tax:audit && npm run links:audit
```

Po większej przeróbce opublikowanego artykułu: przypomnij autorowi o ręcznym zgłoszeniu URL-a
do ponownej indeksacji w Search Console.
