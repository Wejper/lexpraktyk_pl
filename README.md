# lexpraktyk.pl

> Praktyczny portal prawny dla zwykłych ludzi. Dziedziczenie, nieruchomości, ochrona dobrego imienia, notariat — krok po kroku, bez żargonu.

---

## Cel biznesowy

Affiliate blog + lead generation w niszy prawno-notarialnej na polskim rynku. Prawnicy i notariusze są ograniczeni w marketingu przez samorządy zawodowe — co oznacza, że content site z realną głębią może dominować wyniki wyszukiwania przy minimalnej konkurencji.

**Pozycjonowanie:** Nie jesteśmy kancelarią. Jesteśmy przewodnikiem dla osoby, która ma konkretny problem prawny i chce zrozumieć proces zanim wyda pieniądze na prawnika.

---

## Docelowe nisze (priorytet)

### 1. Dziedziczenie i spadki
Ogromny wolumen wyszukiwań, tragiczna jakość istniejących treści.
- zachowek (kalkulator, jak dochodzić)
- dział spadku (sąd vs notariusz)
- odrzucenie spadku (terminy, procedura)
- testament (formy, unieważnienie)
- podatek od spadku

### 2. Nieruchomości i notariat
Wysokie CPC, czytelnik ma konkretną transakcję do przeprowadzenia.
- koszty notarialne (taksa notarialna kalkulator)
- umowa przedwstępna vs przyrzeczona
- co sprawdzić przed kupnem mieszkania
- księga wieczysta (jak czytać, jak sprawdzić)
- podatek PCC przy zakupie nieruchomości

### 3. Ochrona dobrego imienia i pomówienia w internecie
Najwyższa gotowość do zapłaty — czytelnik ma akutny problem.
- jak usunąć fałszywą opinię z Google
- pomówienie w internecie — co grozi, jak reagować
- ochrona dóbr osobistych (pozew, wezwanie)
- UODO — kiedy i jak zgłaszać naruszenia
- zniesławienie vs zniewaga — różnice

### 4. Prawo rodzinne i majątkowe
Duży wolumen, emocjonalny kontekst = wysoka konwersja.
- podział majątku po rozwodzie
- intercyza (kiedy warto, jak spisać)
- alimenty (jak ustalić, jak wyegzekwować)
- rozdzielność majątkowa

---

## Model monetyzacji

### 1. Lead generation do prawników (główny model)
Prawnicy nie mogą się reklamować — mogą płacić za leady.
- 200–800 PLN za kwalifikowany lead (sprawa spadkowa, nieruchomość, dobra osobiste)
- Formularz kontaktowy → przekierowanie do partnera-prawnika
- Docelowo: sieć 5–10 prawników w różnych miastach i specjalizacjach

### 2. Wzory pism i dokumentów
- Wzór wezwania do usunięcia treści z internetu
- Wzór pozwu o ochronę dóbr osobistych
- Wzór odrzucenia spadku
- Cena: 29–99 PLN, zero kosztu marginalnego

### 3. Kalkulatory (freemium)
- Taksa notarialna kalkulator — darmowy podstawowy, szczegółowy raport za opłatą
- Zachowek kalkulator
- Kalkulator kosztów sądowych

### 4. Płatne konsultacje
- 30-min wideorozmowa z partnerskim prawnikiem
- Platforma: Calendly + Stripe
- 150–300 PLN/sesja, lexpraktyk.pl bierze 30–40%

### 5. Ochrona reputacji online (niche service)
- Biznes z akutnym problemem (fałszywe opinie, pomówienie) → płaci za rozwiązanie
- 500–2000 PLN za prowadzenie sprawy (zgłoszenie do Google, UODO, sądu)
- Najwyższy ARPU ze wszystkich modeli

---

## Dlaczego konkurencja jest słaba

| Typ konkurenta | Problem |
|----------------|---------|
| Blogi kancelarii | Brak budżetu SEO, 3 artykuły z 2019 |
| e-prawnik.pl, prawnik24.pl | Q&A forum, brak głębi, zła UX |
| Portale informacyjne (rp.pl) | Newsy, nie poradniki |
| Strony rządowe (gov.pl) | Nieczytelne, brak praktycznego kontekstu |

Nikt nie stworzył polskiego odpowiednika "NerdWallet dla prawa" — serwisu, który tłumaczy skomplikowane procesy prawne prostym językiem z konkretnymi liczbami i krokami.

---

## Stack techniczny

Identyczny jak ogrzeje.pl:
- **Astro 6** + MDX — artykuły statyczne dla SEO
- **@astrojs/node** — SSR dla stron dynamicznych
- **Turso** (SQLite edge DB) — kalkulatory, formularze, lead gen
- **GitHub Actions** — deploy na push + cron dzienny o 5:00 UTC
- **seohost.pl** — hosting z Node.js via Passenger
- **Unsplash API** — okładki artykułów

---

## Autorzy (persony)

Treści muszą brzmieć jak pisane przez prawników-praktyków, nie redakcję bloga. Proponowane persony:

- **Katarzyna Wiśniewska** — specjalizacja: prawo spadkowe, rodzinne
- **Piotr Mazur** — specjalizacja: nieruchomości, prawo cywilne
- **Marta Kowalczyk** — specjalizacja: ochrona dóbr osobistych, RODO

Każdy artykuł przypisany do jednej z person. Bio z wykształceniem prawniczym (ogólne, nie konkretna kancelaria).

---

## Wytyczne jakości treści

YMYL (Your Money Your Life) — Google traktuje treści prawne i finansowe z najwyższą surowością.

- **Cytuj źródła prawne** — artykuły Kodeksu cywilnego, KC, KPC, ustawy
- **Podawaj aktualne daty** — prawo się zmienia, każdy artykuł musi mieć datę aktualizacji
- **Nie dawaj porad prawnych** — "w takiej sytuacji warto skonsultować się z prawnikiem" na końcu każdego artykułu
- **Konkretne liczby** — terminy (6 tygodni na odrzucenie spadku), koszty (taksa notarialna 0,5–3% wartości), progi (podatek od spadku powyżej 9 637 zł)
- **Acknowledge limitations** — każda sytuacja jest inna, artykuł opisuje typowy przypadek

---

## Milestones

| # | Cel | Kiedy | Działanie |
|---|-----|-------|-----------|
| 1 | 50 artykułów opublikowanych | Miesiąc 2 | 3–4 artykuły/tydzień AI-assisted |
| 2 | Kalkulator taksy notarialnej live | Miesiąc 2 | Pierwszy lead magnet |
| 3 | Pierwszy kontakt od prawnika-partnera | Miesiąc 3 | Outreach do 20 kancelarii |
| 4 | 500 kliknięć/miesiąc organic | Miesiąc 4–5 | Dziedziczenie i nieruchomości rankują |
| 5 | Pierwszy przychód (lead lub dokument) | Miesiąc 4–6 | Lead gen lub sprzedaż wzoru pisma |
| 6 | 3 000 kliknięć/miesiąc | Miesiąc 9–12 | Pełny model monetyzacji aktywny |

---

## TODO

- [ ] Zarejestrować domenę lexpraktyk.pl
- [ ] Sklonować stack z ogrzeje.pl, podmienić branding
- [ ] Stworzyć 10 artykułów pilotażowych (po 2–3 na niszę)
- [ ] Zbudować kalkulator taksy notarialnej (Turso + SSR)
- [ ] Outreach do prawników specjalizujących się w spadkach i nieruchomościach
