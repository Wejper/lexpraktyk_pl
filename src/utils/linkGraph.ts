// Graf powiązanych artykułów — liczony raz dla całej kolekcji.
//
// Poprzednio każda strona dobierała sobie trójkę sama: punktacją była liczba wspólnych
// tagów, a remisy rozstrzygała data malejąco. Przy `poradnik` na 38 z 62 artykułów
// remisów były setki, więc faktycznym kryterium stawała się świeżość — te same nowe
// teksty wypływały w całym serwisie, a starsze nie dostawały linków wcale.
//
// Trzy rzeczy, których lokalny dobór nie umie z definicji, bo widzi jedną stronę naraz:
//
//   • wzajemność — jeśli A prowadzi do B, to B powinno prowadzić do A;
//   • limit — żeby jeden artykuł nie zajmował slotu w całym serwisie;
//   • pokrycie — żeby każdy artykuł dostał linki przychodzące, a nie został wyspą.
//
// Stąd graf budowany globalnie. Bliźniaczy plik żyje w drugim repo; trzymać zgodne.

import { primaryCategory, tagWeights } from './taxonomy';

type Article = { id: string; data: { tags?: readonly string[]; publishDate: Date } };

/** Ile linków pokazuje strona artykułu. */
const OUT_DEGREE = 3;

/** Ile razy jeden artykuł może wystąpić jako powiązany, zanim zacznie ustępować innym.
 *  Przy równym rozdaniie każdy wystąpiłby OUT_DEGREE razy; zapas zostawia miejsce na
 *  artykuły-koncentratory, których pokrewieństwo jest po prostu szersze. */
const INBOUND_CAP = OUT_DEGREE * 2;

/** Podobieństwo pary: suma wag IDF wspólnych tagów, znormalizowana długością obu list,
 *  plus premia za wspólną kategorię główną. Normalizacja jest po to, żeby artykuł
 *  otagowany dziesięcioma hasłami nie wygrywał samą liczbą trafień. */
function similarity(
  a: Article,
  b: Article,
  weights: Map<string, number>,
  category: Map<string, string | null>
): number {
  const at = a.data.tags ?? [];
  const bt = b.data.tags ?? [];
  if (!at.length || !bt.length) return 0;

  const shared = at.filter((t) => bt.includes(t));
  const sum = shared.reduce((s, t) => s + (weights.get(t) ?? 0), 0);
  const norm = Math.sqrt(at.length * bt.length);

  const sameCategory = category.get(a.id) && category.get(a.id) === category.get(b.id);
  return (sum / norm) * (sameCategory ? 1.25 : 1);
}

/**
 * Powiązania dla całej kolekcji: id artykułu → lista id, w kolejności malejącego
 * dopasowania.
 *
 * Przydział jest zachłanny po posortowanych parach, w dwóch przebiegach. Pierwszy
 * respektuje limit wystąpień, więc rozkłada linki równo. Drugi domyka strony, którym
 * limit zabrał kandydatów — lepiej przekroczyć limit, niż zostawić stronę bez linków.
 */
export function buildLinkGraph(articles: readonly Article[]): Map<string, string[]> {
  const weights = tagWeights(articles);
  const category = new Map(articles.map((a) => [a.id, primaryCategory(a, weights)]));

  // Remisy rozstrzyga slug alfabetycznie, nie data: build ma być powtarzalny,
  // a świeżość nie ma wypierać trafności.
  const pairs: { from: string; to: string; score: number }[] = [];
  for (const a of articles) {
    for (const b of articles) {
      if (a.id === b.id) continue;
      const score = similarity(a, b, weights, category);
      if (score > 0) pairs.push({ from: a.id, to: b.id, score });
    }
  }
  pairs.sort((x, y) => y.score - x.score || x.from.localeCompare(y.from) || x.to.localeCompare(y.to));

  const out = new Map(articles.map((a) => [a.id, [] as string[]]));
  const inbound = new Map(articles.map((a) => [a.id, 0]));

  const take = (p: { from: string; to: string }) => {
    out.get(p.from)!.push(p.to);
    inbound.set(p.to, inbound.get(p.to)! + 1);
  };
  const eligible = (p: { from: string; to: string }) =>
    out.get(p.from)!.length < OUT_DEGREE && !out.get(p.from)!.includes(p.to);

  for (const p of pairs) if (eligible(p) && inbound.get(p.to)! < INBOUND_CAP) take(p);
  for (const p of pairs) if (eligible(p)) take(p);

  // Pokrycie. Zachłanny przydział zostawia wyspy: artykuł może przegrać każdy slot,
  // choć jest do kogoś najbardziej podobny ze wszystkich. Dla takiego artykułu bierzemy
  // najlepiej dopasowane źródło i — jeśli nie ma już miejsca — oddajemy mu slot celu,
  // który i tak ma linków w nadmiarze. Wyspa kosztuje więcej niż jeden link mniej
  // u artykułu, do którego prowadzi ich sześć.
  for (const orphan of articles.filter((a) => inbound.get(a.id) === 0)) {
    const candidates = pairs.filter((p) => p.to === orphan.id && !out.get(p.from)!.includes(orphan.id));
    for (const p of candidates) {
      const targets = out.get(p.from)!;
      if (targets.length < OUT_DEGREE) { take(p); break; }
      const weakest = [...targets].reverse().find((t) => inbound.get(t)! > 1);
      if (!weakest) continue;
      targets.splice(targets.indexOf(weakest), 1);
      inbound.set(weakest, inbound.get(weakest)! - 1);
      take(p);
      break;
    }
  }

  // Wzajemność: jeśli B trafiło do A, a A ma jeszcze miejsce u B, dopisz je tam.
  // Dwukierunkowa krawędź jest wart więcej niż dwie jednokierunkowe do różnych stron.
  for (const [from, targets] of out) {
    for (const to of targets) {
      const back = out.get(to)!;
      if (!back.includes(from) && back.length < OUT_DEGREE) back.push(from);
    }
  }

  return out;
}

// Strony artykułów renderują się po stronie serwera, więc bez pamięci podręcznej graf
// liczyłby się od nowa przy każdym żądaniu. Klucz to zbiór artykułów: dzienny przebudow
// publikuje zaplanowane teksty i wtedy graf ma się przeliczyć, a między nimi nie ma po co.
let cache: { key: string; graph: Map<string, string[]> } | null = null;

function graphFor(all: readonly Article[]): Map<string, string[]> {
  const key = all.map((a) => a.id).sort().join('|');
  if (cache?.key !== key) cache = { key, graph: buildLinkGraph(all) };
  return cache.graph;
}

/** Powiązane artykuły jednej strony, gotowe do wyrenderowania. */
export function relatedFor<T extends Article>(current: T, all: readonly T[]): T[] {
  const graph = graphFor(all);
  const byId = new Map(all.map((a) => [a.id, a]));
  return (graph.get(current.id) ?? []).map((id) => byId.get(id)!).filter(Boolean);
}
